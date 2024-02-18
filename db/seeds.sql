INSERT INTO department (department_name)
VALUES ('Emergency Medicine'),
       ('Surgery'),
       ('Pediatrics'),
       ('Administration'),
       ('Obstetrics and Gynecology');

INSERT INTO role (role_title, role_salary, department_id) 
VALUES ('Emergency Physician', 120000.00, 1),
       ('Surgeon', 180000.00, 2),
       ('Pediatrician', 150000.00, 3),
       ('Administrator', 80000.00, 4),
       ('Obstetrician/Gynecologist', 160000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Alex', 'Chia', 1, NULL),
       ('Jodie', 'Lee', 2, 1),
       ('Alice', 'Johnson', 3, 1),
       ('Bob', 'Williams', 4, NULL),
       ('Emily', 'Brown', 5, 4),
       ('Michael', 'Davis', 1, NULL),
       ('Sarah', 'Taylor', 2, 6),
       ('David', 'Martinez', 3, 6),
       ('Emma', 'Anderson', 4, NULL),
       ('James', 'Wilson', 5, 9);