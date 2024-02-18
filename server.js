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
    // You would prompt the user for role information here, similar to addDepartment
}

// Function to add an employee
function addEmployee() {
    // You would prompt the user for employee information here, similar to addDepartment
}

// Function to update an employee's role
function updateEmployeeRole() {
    // You would prompt the user for employee and new role information here, similar to addDepartment
}

// Start the application
mainMenu();
