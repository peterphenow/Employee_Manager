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
