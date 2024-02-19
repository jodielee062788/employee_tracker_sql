# Employee Tracker - SQL

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description
The Employee Tracker is a command-line application built with Node.js, Inquirer, and MySQL. It allows users to manage a company's employee database efficiently. Users can perform various tasks such as viewing departments, roles, and employees, adding new departments, roles, and employees, updating employee roles and managers, and deleting departments, roles, and employees. With its intuitive menu system and interactive prompts, the Employee Tracker simplifies tasks such as assigning roles, updating employee information, and tracking department budgets. Whether used by HR professionals, managers, or administrators, the Employee Tracker provides a reliable solution for maintaining accurate and organized employee records.

### Problem Solving
The application empowers users to perform essential tasks, such as adding new employees, updating roles, and viewing department budgets, with ease and accuracy. Its modular design allows for seamless integration with existing databases and workflows, ensuring a smooth transition to automated employee management. 

### Learning
- Node.js Development: Building the Employee Tracker in Node.js enhances proficiency in server-side JavaScript programming and asynchronous event-driven architecture.
- Database Management: Working with MySQL databases strengthens skills in database design, schema creation, querying, and data manipulation.
- Inquirer Integration: Utilizing the Inquirer library for interactive command-line interfaces improves user experience and engagement.
- Modularization: Organizing code into modular components enhances maintainability, scalability, and code reusability.
- Error Handling: Implementing robust error handling mechanisms enhances application reliability and resilience to unexpected inputs or conditions.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Questions](#questions)
- [How To Contribute](#how-to-contribute)

## Installation
To install and run the SVG Logo Maker, follow these steps:

1. Clone the repository to your local machine.
    
    ```git clone git@github.com:jodielee062788/employee_tracker_sql.git```

2. Navigate to the project directory.

    ```cd employee_tracker_sql```

3. Install dependencies using npm.

    ```npm install```

4. Set up your MySQL database. Ensure you have MySQL installed and running on your local machine. You can import the schema.sql and seeds.sql files provided in the repository to create and populate the necessary tables and data.

    ``` mysql -u root -p```

## Usage
To use this repository, follow these steps:

1. Run the application using Node.js

    ```node server.js```
  
    ![Screenshot of executing node server.js command](./images/2.png)

2. Upon starting the application, you'll be presented with a main menu displaying various options:
 - View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Update an employee role
- (Optional) Additional functionalities as per bonus criteria
    - Update employee manager
    - View employees by manager
    - View employees by department
    - Delete department
    - Delete role
    - Delete employee
    - View total utilized budget of a department

    ![Screenshot of the prompts](./images/2.png)

3. Viewing Data: 
Choose the desired option to view departments, roles, or employees.
- For departments: A formatted table will display department names and IDs.
-  For roles: Job titles, role IDs, associated departments, and salaries will be shown.
- For employees: Employee data including IDs, names, job titles, departments, salaries, and managers will be presented.

    ![Screenshot of the generated SVG file](./images/3.png)

4. Adding Data:
- Select the option to add a department, role, or employee.
- Follow the prompts to enter necessary information such as department name, role details, or employee details.
- The entered data will be added to the database.

5. Updating an Employee Role:
- Choose the option to update an employee role.
- Select the employee whose role you want to update.
- Choose the new role for the selected employee.
- The employee's role will be updated in the database.

6. Advanced Functionality (Optional):
- Additional functionalities such as updating employee managers, viewing employees by manager or department, and deleting departments, roles, or employees may be available based on bonus criteria.
- Choose the department to view its total utilized budget, which represents the combined salaries of all employees in that department.

7. Here's a walkthrough video on how to run the application [Walkthrough Video](https://drive.google.com/file/d/1L-y8TNoCY-XDN2JK59fodhw69tHE2woE/view?usp=sharing).

## License
This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for details.

## Questions
For any questions or inquiries, please feel free to reach out to me via email at jodielee062788@gmail.com. 
You can also find me on GitHub: [jodielee062788](https://github.com/jodielee062788)
  
## How To Contribute
If you'd like to contribute to this project, please follow these guidelines:
1. Fork the repository to your GitHub account.
2. Clone the forked repository to your local machine.
3. Create a new branch for your feature or bug fix.
4. Make your changes and commit them with descriptive commit messages.
5. Submit a pull request.
