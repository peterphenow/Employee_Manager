INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
	   ("Arjun", "Valery", 2, 1),
       ("Devi", "Waldeburg", 3, NULL),
       ("Igor", "Linda", 4, 3),
       ("Lyle", "Ibrahim", 5, NULL),
       ("Monica", "Pilar", 6, 5),
       ("Isabella", "Benson", 7, NULL),
       ("Lakshmi", "Agrippa", 8, 7);
       
SELECT * FROM employee;
       
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

INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

SELECT * FROM department;