DROP DATABASE IF EXISTS employee_manager_db;

CREATE DATABASE employee_manager_db;

USE employee_manager_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

SELECT * FROM department;
SELECT department.name FROM department;

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

SELECT * FROM role;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

SELECT * FROM employee;
    
-- template used to test queries before adding to the JS file
SELECT 
	   employee.id AS "ID"
     , CONCAT(employee.first_name, ' ', employee.last_name) AS "Employee"
     , role.title AS "Title"
     , department.name AS "Department"
     , role.salary AS "Salary"
	 , CONCAT(B.first_name, ' ', B.last_name) AS "Manager"
  FROM employee 
  LEFT JOIN role
		ON employee.role_id = role.id
  LEFT JOIN department
		ON role.department_id = department.id
  LEFT JOIN employee B
		ON employee.manager_id = B.id
 WHERE department.name = "Sales";