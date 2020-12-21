USE employee_manager_db;

INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 90000, 1),
       ("Salesperson", 70000, 1),
       ("Lead Engineer", 120000, 2),
       ("Software Engineer", 100000, 2),
       ("Account Manager", 80000, 3),
       ("Accountant", 70000, 3),
       ("Legal Team Lead", 190000, 4),
       ("Lawyer", 150000, 4);
       
SELECT * FROM role;    

-- first add employees without managers
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Doe", 1),
	   ("Devi", "Waldeburg", 3),
       ("Lyle", "Ibrahim", 5),
       ("Isabella", "Benson", 7);

-- then add employees with managers
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Arjun", "Valery", 2, 1),
       ("Igor", "Linda", 4, 2),
       ("Monica", "Pilar", 6, 3),
       ("Lakshmi", "Agrippa", 8, 4);
       
SELECT * FROM employee;