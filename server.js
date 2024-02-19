const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
require('dotenv').config();

// Create a connection to the database
async function createConnection() {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD, // Replace 'password' with your MySQL password
        database: 'employee_db',
    });
}

// Function to display title/banner
function displayTitle() {
    console.log('--------------------------------------------------------');
    console.log('        Health Hospital Employee Tracker System         ');
    console.log('--------------------------------------------------------');
    console.log();
}

// Function to display main menu
async function mainMenu() {
    const connection = await createConnection();
    try {
        while (true) {
            displayTitle();
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        'View all departments',
                        'View all roles',
                        'View all employees',
                        'Add a department',
                        'Add a role',
                        'Add an employee',
                        'Update an employee role',
                        'Update employee manager',
                        'View employees by manager',
                        'View employees by department',
                        'Delete department',
                        'Delete role',
                        'Delete employee',
                        'View total utilized budget of a department',
                        'Exit'
                    ]
                }
            ]);

            switch (answers.action) {
                case 'View all departments':
                    await viewDepartments(connection);
                    break;
                case 'View all roles':
                    await viewRoles(connection);
                    break;
                case 'View all employees':
                    await viewEmployees(connection);
                    break;
                case 'Add a department':
                    await addDepartment(connection);
                    break;
                case 'Add a role':
                    await addRole(connection);
                    break;
                case 'Add an employee':
                    await addEmployee(connection);
                    break;
                case 'Update an employee role':
                    await updateEmployeeRole(connection);
                    break;
                case 'Update employee manager':
                    await updateEmployeeManager(connection);
                    break;
                case 'View employees by manager':
                    await viewEmployeesByManager(connection);
                    break;
                case 'View employees by department':
                    await viewEmployeesByDepartment(connection);
                    break;
                case 'Delete department':
                    await deleteDepartment(connection);
                    break;
                case 'Delete role':
                    await deleteRole(connection);
                    break;
                case 'Delete employee':
                    await deleteEmployee(connection);
                    break;
                case 'View total utilized budget of a department':
                    await viewDepartmentBudget(connection);
                    break;
                case 'Exit':
                    console.log('Goodbye!');
                    return;
                default:
                    console.log('Invalid choice');
            }
        }
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        connection.end(); // Close the database connection
    }
}

// Function to view all departments
async function viewDepartments(connection) {
    const [rows] = await connection.query('SELECT * FROM department');
    console.table(rows);
}

// Function to view all roles
async function viewRoles(connection) {
    const [rows] = await connection.query(`
        SELECT role.id, role.role_title, role.role_salary, department.department_name 
        FROM role 
        INNER JOIN department ON role.department_id = department.id`);
    console.table(rows);
}

// Function to view all employees
async function viewEmployees(connection) {
    const [rows] = await connection.query(`
        SELECT 
            employee.id, employee.first_name, employee.last_name, 
            role.role_title AS job_title, department.department_name, role.role_salary, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`);
    console.table(rows);
}

// Function to add a department
async function addDepartment(connection) {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:'
        }
    ]);
    await connection.execute('INSERT INTO department (department_name) VALUES (?)', [answer.departmentName]);
    console.log('Department added successfully!');
}

// Function to add a role
async function addRole(connection) {
    // Retrieve existing departments from the database
    const [departments] = await connection.query('SELECT id, department_name FROM department');

    // Map departments to a format suitable for inquirer choices
    const departmentChoices = departments.map(department => ({
        name: department.department_name,
        value: department.id
    }));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for the role:',
            choices: departmentChoices
        }
    ]);
    await connection.execute('INSERT INTO role (role_title, role_salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.departmentId]);
    console.log('Role added successfully!');
}

// Function to add an employee
async function addEmployee(connection) {
    // Retrieve existing roles from the database
    const [roles] = await connection.query('SELECT id, role_title FROM role');

    // Retrieve existing employees (managers) from the database
    const [managers] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee');

    // Map roles to a format suitable for inquirer choices
    const roleChoices = roles.map(role => ({
        name: role.role_title,
        value: role.id
    }));

    // Map managers to a format suitable for inquirer choices
    const managerChoices = managers.map(manager => ({
        name: manager.full_name,
        value: manager.id
    }));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the role for the employee:',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the manager for the employee (if applicable):',
            choices: [
                { name: 'None', value: null }, // Option to select no manager
                ...managerChoices
            ]
        }
    ]);

    // If "None" was selected as manager, set managerId to NULL
    if (answers.managerId === null) {
        answers.managerId = null;
    }

    await connection.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, answers.roleId, answers.managerId]);
    console.log('Employee added successfully!');
}

// Function to update an employee's role
async function updateEmployeeRole(connection) {
    // Retrieve existing employees from the database
    const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee');

    // Retrieve existing roles from the database
    const [roles] = await connection.query('SELECT id, role_title FROM role');

    // Map employees to a format suitable for inquirer choices
    const employeeChoices = employees.map(employee => ({
        name: employee.full_name,
        value: employee.id
    }));

    // Map roles to a format suitable for inquirer choices
    const roleChoices = roles.map(role => ({
        name: role.role_title,
        value: role.id
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee whose role you want to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for the employee:',
            choices: roleChoices
        }
    ]);

    await connection.execute('UPDATE employee SET role_id = ? WHERE id = ?', [answers.roleId, answers.employeeId]);
    console.log('Employee role updated successfully!');
}

// Update Employee Managers
async function updateEmployeeManager(connection) {
    const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee');
    const employeeChoices = employees.map(employee => ({
        name: employee.full_name,
        value: employee.id
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee whose manager you want to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the new manager for the employee:',
            choices: employeeChoices
        }
    ]);

    await connection.execute('UPDATE employee SET manager_id = ? WHERE id = ?', [answers.managerId, answers.employeeId]);
    console.log('Employee manager updated successfully!');
}

// View Employees by Manager
async function viewEmployeesByManager(connection) {
    const [managers] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee WHERE manager_id IS NULL');
    const managerChoices = managers.map(manager => ({
        name: manager.full_name,
        value: manager.id
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'managerId',
        message: 'Select a manager to view their employees:',
        choices: managerChoices
    });

    const [rows] = await connection.query(`
        SELECT id, CONCAT(first_name, " ", last_name) AS full_name 
        FROM employee 
        WHERE manager_id = ?
    `, [answer.managerId]);
    console.table(rows);
}

// View Employees by Department
async function viewEmployeesByDepartment(connection) {
    const [departments] = await connection.query('SELECT id, department_name FROM department');
    const departmentChoices = departments.map(department => ({
        name: department.department_name,
        value: department.id
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view its employees:',
        choices: departmentChoices
    });

    const [rows] = await connection.query(`
        SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS full_name 
        FROM employee e
        INNER JOIN role r ON e.role_id = r.id
        WHERE r.department_id = ?
    `, [answer.departmentId]);
    console.table(rows);
}

// Delete Department
async function deleteDepartment(connection) {
    const [departments] = await connection.query('SELECT id, department_name FROM department');
    const departmentChoices = departments.map(department => ({
        name: department.department_name,
        value: department.id
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to delete:',
        choices: departmentChoices
    });

    await connection.execute('DELETE FROM department WHERE id = ?', [answer.departmentId]);
    console.log('Department deleted successfully!');
}

// Delete Role
async function deleteRole(connection) {
    const [roles] = await connection.query('SELECT id, role_title FROM role');
    const roleChoices = roles.map(role => ({
        name: role.role_title,
        value: role.id
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'roleId',
        message: 'Select a role to delete:',
        choices: roleChoices
    });

    await connection.execute('DELETE FROM role WHERE id = ?', [answer.roleId]);
    console.log('Role deleted successfully!');
}

// Delete Employee
async function deleteEmployee(connection) {
    const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee');
    const employeeChoices = employees.map(employee => ({
        name: employee.full_name,
        value: employee.id
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'employeeId',
        message: 'Select an employee to delete:',
        choices: employeeChoices
    });

    await connection.execute('DELETE FROM employee WHERE id = ?', [answer.employeeId]);
    console.log('Employee deleted successfully!');
}

// View Total Utilized Budget of a Department
async function viewDepartmentBudget(connection) {
    const [departments] = await connection.query('SELECT id, department_name FROM department');
    const departmentChoices = departments.map(department => ({
        name: department.department_name,
        value: department.id
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view its total utilized budget:',
        choices: departmentChoices
    });

    const [result] = await connection.query('SELECT SUM(r.role_salary) AS total_budget FROM employee e JOIN role r ON e.role_id = r.id WHERE r.department_id = ?', [answer.departmentId]);
    console.log(`Total Utilized Budget of ${departmentChoices.find(dep => dep.value === answer.departmentId).name}: $${result[0].total_budget}`);
}

// Start the application
mainMenu();
