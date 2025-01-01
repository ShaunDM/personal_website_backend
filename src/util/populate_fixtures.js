const fs = require("node:fs");
const Holidays = require("date-holidays");

const today = Date.now();
const dayInMs = 86400000;
const yearInMs = 31536000000;
const todayMinus2Wks = today - dayInMs * 14;
const todayPlus5Yrs = today + yearInMs * 5;

//generates a random positive integer, divisible by 10, 100 max.
function pointGenerator() {
  return (Math.floor(Math.random() * 9) + 1) * 10;
}

function generateHolidays(country = "US") {
  const hd = new Holidays(country);
  const date_columns = ["date", "name"];
  const data = [];

  for (let date = todayMinus2Wks; date <= todayPlus5Yrs; date += yearInMs) {
    //For some reason date-holidays package shows holidays a day late.
    const year = new Date(date).getFullYear();
    const holidays = hd.getHolidays(year);
    for (let i = 0; i < holidays.length; i++) {
      if (date > Date.parse(holidays[i].date)) {
        continue;
      }
      const entry = new Object();
      date_columns.map((column) => (entry[column] = holidays[i][column]));
      data.push(entry);
    }
  }

  fs.writeFile(
    "./src/db/fixtures/holidays.json",
    JSON.stringify({ data: data }),
    (err) => {
      if (err) throw err;
      console.log("Holidays have been generated in fixture");
    }
  );
}

function generateRepeatedTasks() {
  const data = [];

  const repeated_task_columns = [
    "repeated_task_name",
    "implement_start",
    "implement_end",
    "task_length_days",
    "start_time",
    "end_time",
    "points",
    "important",
    "repeat_method",
    "repeat_values",
    "tasks_id",
  ];

  const taskNames = [
    "bang head",
    "stub toe",
    "let phone die",
    "get stuck in traffic",
    "fall in the toilet",
    "forget wallet",
    "lose keys",
  ];

  taskNames.forEach((taskName) => {
    const task = new Object();
    repeated_task_columns.forEach((column) => {});
  });

  fs.writeFile(
    "./src/db/fixtures/repeated_tasks.json",
    JSON.stringify({ data: data }),
    (err) => {
      if (err) throw err;
      console.log("Repeated tasks have been generated in fixture");
    }
  );
}

const task_list_columns = [
  "task_id",
  "task_name",
  "start_time",
  "end_time",
  "points",
  "important",
];

const task_columns = [
  "task_name",
  "start_date",
  "end_date",
  "start_time",
  "end_time",
  "points",
  "important",
  "completed",
  "repeated_tasks_id",
];

const tasks = [
  "join a cult",
  "buy a corvet",
  "get into mma",
  "divorce my wife",
  "date women half my age",
  "abandon kids",
  "move into a one bedroom apartment",
];

const date_schedule_columns = ["date", "task_name"];

const calendar_info = ["start_calendar", "end_calendar", "last_login"];

switch (process.argv[2]) {
  case "generateHolidays": {
    generateHolidays();
    break;
  }
  default: {
    break;
  }
}

module.exports = {
  generateHolidays,
};
