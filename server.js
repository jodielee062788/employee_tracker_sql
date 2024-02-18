const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // Replace 'password' with your MySQL password
    database: 'employee_db'
});

// Function to display main menu
function mainMenu() {
    inquirer.prompt([
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
                'Exit'
            ]
        }
    ]).then((answers) => {
        // Call the appropriate function based on user's choice
        switch (answers.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                console.log('Goodbye!');
                db.end(); // Close the database connection
                break;
            default:
                console.log('Invalid choice');
                mainMenu(); // Show the main menu again
        }
    });
}

// Function to view all departments
function viewDepartments() {
    const query = 'SELECT * FROM department';
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        // After displaying results, show the main menu again
        mainMenu();
    });
}

// Function to view all roles
function viewRoles() {
    const query = `
        SELECT role.id, role.title, role.salary, department.department_name 
        FROM role 
        INNER JOIN department ON role.department_id = department.id`;
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        // After displaying results, show the main menu again
        mainMenu();
    });
}

// Function to view all employees
function viewEmployees() {
    const query = `
        SELECT 
            employee.id, employee.first_name, employee.last_name, 
            role.title AS job_title, department.department_name, role.salary, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        // After displaying results, show the main menu again
        mainMenu();
    });
}

// Function to add a department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:'
        }
    ]).then((answer) => {
        const query = 'INSERT INTO department (department_name) VALUES (?)';
        db.query(query, answer.departmentName, (err, result) => {
            if (err) throw err;
            console.log('Department added successfully!');
            // After adding the department, show the main menu again
            mainMenu();
        });
    });
}

// Function to add a role
function addRole() {
    inquirer.prompt([
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
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID for the role:'
        }
    ]).then((answer) => {
        const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        db.query(query, [answer.title, answer.salary, answer.departmentId], (err, result) => {
            if (err) throw err;
            console.log('Role added successfully!');
            // After adding the role, show the main menu again
            mainMenu();
        });
    });
}

// Function to add an employee
function addEmployee() {
    inquirer.prompt([
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
            type: 'input',
            name: 'roleId',
            message: 'Enter the role ID for the employee:'
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the manager ID for the employee (if applicable):'
        }
    ]).then((answer) => {
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        db.query(query, [answer.firstName, answer.lastName, answer.roleId, answer.managerId], (err, result) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            // After adding the employee, show the main menu again
            mainMenu();
        });
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'Enter the ID of the employee whose role you want to update:'
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the new role ID for the employee:'
        }
    ]).then((answer) => {
        const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
        db.query(query, [answer.roleId, answer.employeeId], (err, result) => {
            if (err) throw err;
            console.log('Employee role updated successfully!');
            // After updating the employee role, show the main menu again
            mainMenu();
        });
    });
}


// Start the application
mainMenu();
