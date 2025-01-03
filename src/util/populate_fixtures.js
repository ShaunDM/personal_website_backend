const fs = require("node:fs");
const Holidays = require("date-holidays");

const today = Date.now();
const minuteInMs = 60000;
const dayInMs = 86400000;
const yearInMs = 31536000000;
const todayMinus6Months = today - dayInMs * 180;
const todayMinus2Wks = today - dayInMs * 14;
const todayPlus5Yrs = today + yearInMs * 5;
const todayPlus10Yrs = today + yearInMs * 10;

//generates a random positive integer, divisible by 10, 100 max.
function pointGenerator() {
  return (Math.floor(Math.random() * 9) + 1) * 10;
}

function randomNumber(max, min) {
  let number = 0;
  if (min) number = Math.floor(Math.random() * (max - min) + min);
  number = Math.floor(Math.random() * max);
  if (number === max) number--;
  return number;
}

function generateHolidays(country = "US") {
  const hd = new Holidays(country);
  const date_columns = ["date", "name"];
  const data = [];
  console.log(today);

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

function generateTasks() {
  console.log(new Date(today));
  // const task_columns = [
  //   "task_name",
  //   "start",
  //   "end",
  //   "points",
  //   "important",
  //   "completed",
  // ];

  const tasks = [
    "Wallow in self pity",
    "Stare into the abyss",
    "Solve world hunger, tell no one",
    "Jazzercize",
    "Dinner with me",
    "Wrestle with my self loathing",
    "Stare at the ceiling and slip slowly into madness",
  ];

  const data = [];

  for (let i = todayMinus6Months; i < today + yearInMs; i += dayInMs) {
    //chance to skip day
    if (randomNumber(5) < 2) continue;

    //gets the timestamp for the end of the day for the sake of setting a maximum for the random time the task starts.
    const EOD = new Date(i).toString().replace(/\d{2}:\d{2}:\d{2}/, "23:59:59");
    const timeStampEOD = Date.parse(EOD);
    for (let j = 0; j < 10; j++) {
      //chance to skip making a task, should avg 3-4 tasks per day
      if (randomNumber(3) > 0) continue;
      const entry = new Object();

      entry.task_name = tasks[randomNumber(7)];
      entry.start = randomNumber(timeStampEOD, i);
      entry.end = randomNumber(
        entry.start + dayInMs * 7,
        entry.start + minuteInMs * 15
      );
      entry.points = pointGenerator();
      entry.important = false;
      if (randomNumber(7) > 5) entry.important = true;
      entry.completed = false;
      if (i < today && randomNumber(3) > 0) entry.completed = true;
      data.push(entry);
    }
  }

  fs.writeFile(
    "./src/db/fixtures/tasks.json",
    JSON.stringify({ data: data }),
    (err) => {
      if (err) throw err;
      console.log("Tasks have been generated in fixture");
    }
  );
}

function generateRepeatedTasks() {
  /*repeat methods: 
  0_daily-select repeat based on days of the week, can have one or multiple repeats per week
  1_weekly-repeats based on what week in the month it is, can specify a day for instance the first saturday
  2_monthly-can be first, last, or a selected day(s) in a month
  3_quarterly-select a day(s) within 4 3 month blocks.
  4_yearly- select one or multiple days to repeat a task a year
  5_days- select a number of days between tasks, min 1
  */
  const data = [];

  const repeated_task_columns = [
    "repeated_task_name",
    "implement_start",
    "implement_end",
    "task_length_days",
    "points",
    "important",
    "repeat_method",
    "repeat_values",
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

function generateGroupedTasks() {
  const data = [];

  const grouped_tasks_columns = [
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
    "Project A",
    "Proposal 1",
    "Tasklist Green",
    "Quarterly Goals Omega",
    "Quest: Find the Holy Grail",
    "Plan ABABSelectStart",
    "Make it RICH with these easy steps",
  ];

  taskNames.forEach((taskName) => {
    const task = new Object();
    repeated_task_columns.forEach((column) => {});
  });

  fs.writeFile(
    "./src/db/fixtures/grouped_tasks.json",
    JSON.stringify({ data: data }),
    (err) => {
      if (err) throw err;
      console.log("Repeated tasks have been generated in fixture");
    }
  );
}

function generateTaskList() {
  const data = [];

  const task_list_columns = [
    "task_id",
    "task_name",
    "start_time",
    "end_time",
    "points",
    "important",
  ];

  taskNames.forEach((taskName) => {
    const task = new Object();
    repeated_task_columns.forEach((column) => {});
  });

  fs.writeFile(
    "./src/db/fixtures/task_list.json",
    JSON.stringify({ data: data }),
    (err) => {
      if (err) throw err;
      console.log("Task list has been generated in fixture");
    }
  );
}

const date_schedule_columns = ["date", "task_name"];

const calendar_info = ["start_calendar", "end_calendar", "last_login"];

switch (process.argv[2]) {
  case "generateHolidays": {
    generateHolidays();
    break;
  }
  case "generateTasks": {
    generateTasks();
    break;
  }

  default: {
    break;
  }
}

module.exports = {
  generateHolidays,
  generateTasks,
};
