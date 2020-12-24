const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// set up ASCII art
const logo = require("asciiart-logo");
const config = require("./package.json");
config.font = "soft";
config.logoColor = "bold-orange";
config.textColor = "grey";
config.borderColor = "orange";
config.margin = "5";
console.log(logo(config).render());

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employee_manager_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  inquirer
    .prompt({
      name: "doSomething",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Something", "Add Something", "Remove Something", "Update Something"],
    })
    .then(function (answer) {
      console.log(answer.doSomething);
      switch (answer.doSomething) {
        case "View Something":
          viewSomething();
          break;

        case "Add Something":
          //addSomething();
          break;

        case "Remove Something":
          //removeSomething();
          break;

        case "Update Something":
          //updateSomething();
          break;
      }
    });
}

function viewSomething() {
  inquirer
    .prompt({
      name: "viewSomething",
      type: "list",
      message: "What would you like to view?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "View All Departments",
        "View All Roles",
      ],
    })
    .then(function (answer) {
      console.log(answer.viewSomething);
      switch (answer.viewSomething) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Employees By Department":
          viewEmployeesByDepartment();
          break;

        case "View All Employees By Manager":
          viewEmployeesByManager();
          break;

        case "View All Departments":
          viewDepartments();
          break;

        case "View All Roles":
          viewRoles();
      }
    });
}

// [
//   "View All Employees",
//   "View All Employees By Department",
//   "View All Employees By Manager",
//   "View All Departments",
//   "View All Roles",
//   "Add Employee",
//   "Add Department",
//   "Add Role",
//   "Remove Employee",
//   "Remove Employee Roles",
//   "Remove Department",
//   "Update Employee Role",
//   "Update Employee Manager",
// ],

//function to view all employees
function viewEmployees() {
  let query = `SELECT 
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
                    ON employee.manager_id = B.id;`;
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("===================================================================");
    console.table(res);
    console.log("===================================================================");
    start();
  });
}

//create array of departments to use as choices.  Upon adding a new department, will push new department to this array
let deptsArr = ["Sales", "Engineering", "Finance", "Legal"];

// function to view all employees based on department selected
function viewEmployeesByDepartment() {
  inquirer
    .prompt({
      name: "viewDepartment",
      type: "list",
      message: "What department would you like to view?",
      choices: deptsArr,
    })
    .then(function (answer) {
      console.log(answer.viewDepartment);
      let query = `SELECT 
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
                      WHERE department.name = "${answer.viewDepartment}"`;
      connection.query(query, function (err, res) {
        if (err) throw err;

        console.log("===================================================================");
        console.table(res);
        console.log("===================================================================");
        start();
      });
    });
}

let managersArr = ["John Doe", "Devi Waldeburg", "Lyle Ibrahim", "Isabella Benson"];

//function to view employees based on manager
function viewEmployeesByManager() {
  inquirer
    .prompt({
      name: "viewByManager",
      type: "list",
      message: "What manager's employees would you like to view?",
      choices: managersArr,
    })
    .then(function (answer) {
      console.log(answer.viewByManager);
      let query = `SELECT *
                    FROM (
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
                        )
                  AS data
                  WHERE Employee = "${answer.viewByManager}"
                    OR Manager = "${answer.viewByManager}"`;
      connection.query(query, function (err, res) {
        if (err) throw err;

        console.log("===================================================================");
        console.table(res);
        console.log("===================================================================");
        start();
      });
    });
}

//function to view all departments
function viewDepartments() {
  let query = `SELECT * FROM department`;
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("===================================================================");
    console.table(res);
    console.log("===================================================================");
    start();
  });
}

//function to view all roles
function viewRoles() {
  let query = `SELECT  
                      role.id AS "ID"
                    , role.title AS "Title"
                    , role.salary AS "Salary"
                    , department.name AS "Department"
                 FROM role
                 LEFT JOIN department
                   ON role.department_id = department.id`;
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.log("===================================================================");
    console.table(res);
    console.log("===================================================================");
    start();
  });
}
