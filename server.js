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
          //viewEmployees();
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

            console.log("-----------------------------------------", "\n");

            console.table(res);

            console.log("-----------------------------------------", "\n");
          });
          start();
          break;

        case "View All Employees By Department":
          //viewEmployeesByDepartment();
          break;

        case "View All Employees By Manager":
          //viewEmployeesByManager();
          break;

        case "View All Departments":
          //viewDepartments();
          break;

        case "View All Roles":
        //viewRoles()
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
