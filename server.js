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
  //populate the manager, department, and roles arrays
  createManagerArr();
  createManagerArrWithId();
  createDeptsArr();
  createDeptsArrWithId();
  createRolesArr();
  createEmployeeArr();
  createEmployeeArrWithId();

  inquirer
    .prompt({
      name: "doSomething",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Something", "Add Something", "Update Something", "Remove Something"],
    })
    .then(function (answer) {
      console.log(answer.doSomething);
      switch (answer.doSomething) {
        case "View Something":
          viewSomething();
          break;

        case "Add Something":
          addSomething();
          break;

        case "Update Something":
          updateSomething();
          break;

        case "Remove Something":
          removeSomething();
          break;
      }
    });
}

// ================== Begin VIEW Section ==================
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

// =================== End VIEW Section ==========================
// =================== Begin ADD Section =========================

//function to determine what to add
function addSomething() {
  inquirer
    .prompt({
      name: "addSomething",
      type: "list",
      message: "What would you like to add?",
      choices: ["Add Employee", "Add Department", "Add Role"],
    })
    .then(function (answer) {
      console.log(answer.addSomething);
      switch (answer.addSomething) {
        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;
      }
    });
}

//function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: rolesArr,
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the employee's manager?",
        choices: managersArrWithId,
      },
    ])
    .then((resp) => {
      //console.log(resp.firstName, resp.lastName, resp.role.slice(0, 1), resp.manager.slice(0, 1));
      let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ('${resp.firstName}', '${resp.lastName}', ${resp.role.substring(
        0,
        resp.role.indexOf(" ")
      )}, ${resp.manager.substring(0, resp.manager.indexOf(" "))})`;

      connection.query(query, function (err, res) {
        if (err) throw err;

        console.log("===================================================================");
        console.log(`${resp.firstName} ${resp.lastName} was added to the database.`);
        console.log("===================================================================");
        start();
      });
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "input",
        message: "What is the name of the new department?",
      },
    ])
    .then((resp) => {
      let query = `INSERT INTO department (name)
                     VALUES ('${resp.deptName}')`;
      connection.query(query, function (err, res) {
        if (err) throw err;

        console.log("===================================================================");
        console.log(`${resp.deptName} was added to the database.`);
        console.log("===================================================================");
        start();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "roleName",
        type: "input",
        message: "What is the name of the new role?",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What is the annual salary for the new role?",
      },
      {
        name: "roleDept",
        type: "list",
        message: "What department will this new role be a part of?",
        choices: deptsArrWithId,
      },
    ])
    .then((resp) => {
      let query = `INSERT INTO role (title, salary, department_id)
                     VALUES ('${resp.roleName}', ${resp.roleSalary}, ${resp.roleDept.substring(
        0,
        resp.roleDept.indexOf(" ")
      )})`;
      connection.query(query, function (err, res) {
        if (err) throw err;

        console.log("===================================================================");
        console.log(`${resp.roleName} was added to the database.`);
        console.log("===================================================================");
        start();
      });
    });
}

// ==================== End ADD Section =========================
// ==================== Begin UPDATE Section ====================

//function to determine what to update
function updateSomething() {
  inquirer
    .prompt({
      name: "updateSomething",
      type: "list",
      message: "What would you like to update?",
      choices: ["Update Employee Role", "Update Employee Manager"],
    })
    .then(function (answer) {
      console.log(answer.updateSomething);
      switch (answer.updateSomething) {
        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Update Employee Manager":
          updateEmployeeManager();
          break;
      }
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employees' role do you want to update?",
        choices: employeeArrWithId,
      },
      {
        name: "newRole",
        type: "list",
        message: "What is the new role?",
        choices: rolesArr,
      },
    ])
    .then((resp) => {
      //console.log(resp);
      // resp.newRole.substring(0, resp.newRole.indexOf(" ")) will get everything before the first " "
      let query = `UPDATE employee
                     SET role_id = ${resp.newRole.substring(0, resp.newRole.indexOf(" "))}
                     WHERE employee.id = ${resp.employee.substring(0, resp.employee.indexOf(" "))}`;
      connection.query(query, function (err, res) {
        if (err) throw err;

        //resp.newRole.substring(resp.newRole.indexOf(" ") + 1) will get everything after the first " "
        console.log("===================================================================");
        console.log(
          `${resp.employee.substring(
            resp.employee.indexOf(" ") + 1
          )}'s role was updated to ${resp.newRole.substring(resp.newRole.indexOf(" ") + 1)}.`
        );
        console.log("===================================================================");
        start();
      });
    });
}

function updateEmployeeManager() {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employees' manager do you want to update?",
        choices: employeeArrWithId,
      },
      {
        name: "newManager",
        type: "list",
        message: "Who is the new manager?",
        choices: managersArrWithId,
      },
    ])
    .then((resp) => {
      //console.log(resp);
      // resp.newRole.substring(0, resp.newRole.indexOf(" ")) will get everything before the first " "
      let query = `UPDATE employee
                     SET manager_id = ${resp.newManager.substring(0, resp.newManager.indexOf(" "))}
                     WHERE employee.id = ${resp.employee.substring(0, resp.employee.indexOf(" "))}`;
      connection.query(query, function (err, res) {
        if (err) throw err;

        //resp.newManager.substring(resp.newManager.indexOf(" ") + 1) will get everything after the first " "
        console.log("===================================================================");
        console.log(
          `${resp.employee.substring(
            resp.employee.indexOf(" ") + 1
          )}'s manager was updated to ${resp.newManager.substring(
            resp.newManager.indexOf(" ") + 1
          )}.`
        );
        console.log("===================================================================");
        start();
      });
    });
}

// ==================== End UPDATE Section ======================
// ==================== Begin REMOVE Section ====================

//function to determine what to update
function removeSomething() {
  inquirer
    .prompt({
      name: "removeSomething",
      type: "list",
      message: "What would you like to remove?",
      choices: ["Remove Employee", "Remove Role", "Remove Department"],
    })
    .then(function (answer) {
      console.log(answer.updateSomething);
      switch (answer.updateSomething) {
        case "Remove Employee":
          //removeEmployee();
          break;

        case "Remove Role":
          //removeRole();
          break;

        case "Remove Department":
          //removeDepartment();
          break;
      }
    });
}

// ==================== End REMOVE Section ======================
// =============== Begin ARRAY CREATE Section ===================

//function to populate the departments array with all current departments
let deptsArr = [];
function createDeptsArr() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    deptsArr = [];
    for (let i = 0; i < res.length; i++) {
      deptsArr.push(res[i].name);
    }
  });
}

//function to populate the departments array with all current departments, includes ID for adding new roles
let deptsArrWithId = [];
function createDeptsArrWithId() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    deptsArrWithId = [];
    for (let i = 0; i < res.length; i++) {
      deptsArrWithId.push(res[i].id + " " + res[i].name);
    }
  });
}

//function to populate the managers array with all current managers
let managersArr = [];
function createManagerArr() {
  connection.query("SELECT * FROM employee WHERE manager_id IS null", (err, res) => {
    if (err) throw err;
    managersArr = [];
    for (let i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name + " " + res[i].last_name);
    }
  });
}

//function to populate the managers array with all current managers.  This include the ID for adding new employees
let managersArrWithId = [];
function createManagerArrWithId() {
  connection.query("SELECT * FROM employee WHERE manager_id IS null", (err, res) => {
    if (err) throw err;
    managersArrWithId = [];
    for (let i = 0; i < res.length; i++) {
      managersArrWithId.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name);
    }
  });
}

//function to populate roles array with all current roles
let rolesArr = [];
function createRolesArr() {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    rolesArr = [];
    for (let i = 0; i < res.length; i++) {
      rolesArr.push(res[i].id + " " + res[i].title);
    }
  });
}

//function to populate roles array with all current roles
let employeeArr = [];
function createEmployeeArr() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    employeeArr = [];
    for (let i = 0; i < res.length; i++) {
      employeeArr.push(res[i].first_name + " " + res[i].last_name);
    }
  });
}

//function to populate roles array with all current roles
let employeeArrWithId = [];
function createEmployeeArrWithId() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    employeeArrWithId = [];
    for (let i = 0; i < res.length; i++) {
      employeeArrWithId.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name);
    }
  });
}

// [
//   X "View All Employees",
//   X "View All Employees By Department",
//   X "View All Employees By Manager",
//   X "View All Departments",
//   X "View All Roles",
//   X "Add Employee",
//   X "Add Department",
//   X "Add Role",
//   "Remove Employee",
//   "Remove Employee Roles",
//   "Remove Department",
//   X "Update Employee Role",
//   X "Update Employee Manager",
// ],
