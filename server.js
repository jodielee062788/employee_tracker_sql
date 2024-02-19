// Import required modules
const mysql = require('mysql2/promise'); // MySQL client library for Node.js
const inquirer = require('inquirer'); // Module for interactive command-line user interfaces
require('dotenv').config(); // Load environment variables from .env file

// Function to create a connection to the database
async function createConnection() {
    // Establish a connection to the MySQL database using credentials from environment variables
    return await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD, // MySQL password from environment variables
        database: 'employee_db', // Name of the database
    });
}

// Function to display title/banner
function displayTitle() {
    // Display a title/banner for the application
    console.log();
    console.log('--------------------------------------------------------');
    console.log('        Health Hospital Employee Tracker System         ');
    console.log('--------------------------------------------------------');
    console.log();
}

// Function to display main menu
async function mainMenu() {
    // Create a connection to the database
    const connection = await createConnection();
    try {
        while (true) {
            // Display the main menu options
            displayTitle();
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        // List of available actions in the main menu
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

            // Perform the selected action based on user input
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
                    console.log('Goodbye! Thank you for using the program.');
                    return;
                default:
                    console.log('Invalid choice');
            }
        }
    } catch (error) {
        // Handle any errors that occur during execution
        console.error('Error occurred:', error);
    } finally {
        // Close the database connection when the application exits
        connection.end();
    }
}

// Function to view all departments
async function viewDepartments(connection) {
    // Retrieve all departments from the database and display them
    const [rows] = await connection.query('SELECT * FROM department');
    console.table(rows);
}

// Function to view all roles
async function viewRoles(connection) {
    // Retrieve all roles from the database and display them with associated department names
    const [rows] = await connection.query(`
        SELECT role.id, role.role_title, role.role_salary, department.department_name 
        FROM role 
        INNER JOIN department ON role.department_id = department.id`);
    console.table(rows);
}

// Function to view all employees
async function viewEmployees(connection) {
    // Retrieve all employees from the database and display them with their roles, departments, and managers
    const [rows] = await connection.query(`
        SELECT 
            employee.id, employee.first_name, employee.last_name, 
            role.role_title AS role_title, department.department_name, role.role_salary, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`);
    console.table(rows);
}

// Function to add a department
async function addDepartment(connection) {
    // Prompt the user to enter the name of the new department and insert it into the database
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

    // Prompt the user to enter details of the new role and insert it into the database
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

    // Prompt the user to enter details of the new employee and insert it into the database
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

    // Insert the new employee into the database
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

    // Prompt the user to select the employee and the new role, then update the employee's role in the database
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

    // Update the employee's role in the database
    await connection.execute('UPDATE employee SET role_id = ? WHERE id = ?', [answers.roleId, answers.employeeId]);
    console.log('Employee role updated successfully!');
}

// Function to update an employee's manager
async function updateEmployeeManager(connection) {
    // Retrieve existing employees from the database
    const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee');

    // Map employees to a format suitable for inquirer choices
    const employeeChoices = employees.map(employee => ({
        name: employee.full_name,
        value: employee.id
    }));

    // Prompt the user to select the employee and the new manager, then update the employee's manager in the database
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

    // Update the employee's manager in the database
    await connection.execute('UPDATE employee SET manager_id = ? WHERE id = ?', [answers.managerId, answers.employeeId]);
    console.log('Employee manager updated successfully!');
}

// Function to view employees by manager
async function viewEmployeesByManager(connection) {
    // Retrieve top-level managers (employees without a manager) from the database
    const [managers] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee WHERE manager_id IS NULL');

    // Map managers to a format suitable for inquirer choices
    const managerChoices = managers.map(manager => ({
        name: manager.full_name,
        value: manager.id
    }));

    // Prompt the user to select a manager, then display all employees managed by that manager
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'managerId',
        message: 'Select a manager to view their employees:',
        choices: managerChoices
    });

    // Retrieve and display all employees managed by the selected manager
    const [rows] = await connection.query(`
        SELECT id, CONCAT(first_name, " ", last_name) AS full_name 
        FROM employee 
        WHERE manager_id = ?
    `, [answer.managerId]);
    console.table(rows);
}

// Function to view employees by department
async function viewEmployeesByDepartment(connection) {
    // Retrieve all departments from the database
    const [departments] = await connection.query('SELECT id, department_name FROM department');

    // Map departments to a format suitable for inquirer choices
    const departmentChoices = departments.map(department => ({
        name: department.department_name,
        value: department.id
    }));

    // Prompt the user to select a department, then display all employees in that department
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view its employees:',
        choices: departmentChoices
    });

    // Retrieve and display all employees in the selected department
    const [rows] = await connection.query(`
        SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS full_name 
        FROM employee e
        INNER JOIN role r ON e.role_id = r.id
        WHERE r.department_id = ?
    `, [answer.departmentId]);
    console.table(rows);
}

// Function to delete a department
async function deleteDepartment(connection) {
    // Retrieve all departments from the database
    const [departments] = await connection.query('SELECT id, department_name FROM department');

    // Map departments to a format suitable for inquirer choices
    const departmentChoices = departments.map(department => ({
        name: department.department_name,
        value: department.id
    }));

    // Prompt the user to select a department to delete, then delete it from the database
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to delete:',
        choices: departmentChoices
    });

    // Delete the selected department from the database
    await connection.execute('DELETE FROM department WHERE id = ?', [answer.departmentId]);
    console.log('Department deleted successfully!');
}

// Function to delete a role
async function deleteRole(connection) {
    // Retrieve all roles from the database
    const [roles] = await connection.query('SELECT id, role_title FROM role');

    // Map roles to a format suitable for inquirer choices
    const roleChoices = roles.map(role => ({
        name: role.role_title,
        value: role.id
    }));

    // Prompt the user to select a role to delete, then delete it from the database
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'roleId',
        message: 'Select a role to delete:',
        choices: roleChoices
    });

    // Delete the selected role from the database
    await connection.execute('DELETE FROM role WHERE id = ?', [answer.roleId]);
    console.log('Role deleted successfully!');
}

// Function to delete an employee
async function deleteEmployee(connection) {
    // Retrieve all employees from the database
    const [employees] = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS full_name FROM employee');

    // Map employees to a format suitable for inquirer choices
    const employeeChoices = employees.map(employee => ({
        name: employee.full_name,
        value: employee.id
    }));

    // Prompt the user to select an employee to delete, then delete it from the database
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'employeeId',
        message: 'Select an employee to delete:',
        choices: employeeChoices
    });

    // Delete the selected employee from the database
    await connection.execute('DELETE FROM employee WHERE id = ?', [answer.employeeId]);
    console.log('Employee deleted successfully!');
}

// Function to view the total utilized budget of a department
async function viewDepartmentBudget(connection) {
    // Retrieve all departments from the database
    const [departments] = await connection.query('SELECT id, department_name FROM department');

    // Map departments to a format suitable for inquirer choices
    const departmentChoices = departments.map(department => ({
        name: department.department_name,
        value: department.id
    }));

    // Prompt the user to select a department, then calculate and display its total utilized budget
    const answer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select a department to view its total utilized budget:',
        choices: departmentChoices
    });

    // Calculate the total utilized budget of the selected department
    const [result] = await connection.query('SELECT SUM(r.role_salary) AS total_budget FROM employee e JOIN role r ON e.role_id = r.id WHERE r.department_id = ?', [answer.departmentId]);
    console.log(`Total Utilized Budget of ${departmentChoices.find(dep => dep.value === answer.departmentId).name}: $${result[0].total_budget}`);
}

// Start the application by displaying the main menu
mainMenu();
