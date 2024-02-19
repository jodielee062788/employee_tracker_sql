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
       ('Jodie', 'Lee', 2, NULL),
       ('Alice', 'Johnson', 4, NULL),
       ('Kim', 'Williams', 5, NULL),
       ('Christian', 'Brown', 5, 4),
       ('Joshua', 'Davis', 4, 3),
       ('Seven', 'Taylor', 3, NULL),
       ('Rodie', 'Martinez', 3, 7),
       ('Josie', 'Anderson', 2, 2),
       ('Loki', 'Wilson', 5, 3);