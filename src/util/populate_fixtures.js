const fs = require("node:fs");
const Holidays = require("date-holidays");

const today = Date.now();
const timezoneOffset = new Date(today).getTimezoneOffset();
const minuteInMs = 60000;
const hourInMs = minuteInMs * 60;
const dayInMs = hourInMs * 24;
const weekInMs = dayInMs * 7;
const yearInMs = 31536000000;
const leapYearInMs = 31536000000 + dayInMs;
const todayMinus2Wks = today - dayInMs * 14;
const todayMinus6Months = today - dayInMs * 180;
const todayPlus5Yrs = today + yearInMs * 5;
const todayPlus10Yrs = today + yearInMs * 10;

function writeFile(path, data) {
  fs.writeFile(
    `./src/db/fixtures/${path}.json`,
    JSON.stringify({ data: data }),
    (err) => {
      if (err) throw err;
      const name = path[0].toUpperCase() + path.slice(1);
      console.log(`${name.replace("_", " ")} have been populated in fixture`);
    }
  );
}

//generates a random positive integer, divisible by 10, 100 max.
function pointGenerator() {
  return (Math.floor(Math.random() * 9) + 1) * 10;
}

//generates a random integer from (max - 1) to min. If min is omitted it will default to 0.
function randomNumber(max, min) {
  let number = 0;
  if (min) number = Math.floor(Math.random() * (max - min) + min);
  else number = Math.floor(Math.random() * max);
  if (number === max) number--;
  return number;
}

//generates a random float with accuracy up to 10^-2, from (max - 1) to min. If min is omitted it will default to 0.
function randomFloat(max, min) {
  let number = 0;
  if (min) number = Math.random() * (max - min) + min;
  number = Math.random() * max;
  if (number === max) number--;
  return number.toFixed(2);
}

//gets the UTC date for a given timestamp with
function getUTC(
  timestamp,
  fullDate = {
    year: new Date(timestamp).getUTCFullYear(),
    month: new Date(timestamp).getUTCMonth(),
    date: new Date(timestamp).getUTCDate(),
    hr: new Date(timestamp).getUTCHours(),
    min: new Date(timestamp).getUTCMinutes(),
  }
) {
  let { year, month, date, hr, min } = fullDate;
  if (!year) year = new Date(timestamp).getUTCFullYear();
  if (!month) month = new Date(timestamp).getUTCMonth();
  if (!date) date = new Date(timestamp).getUTCDate();
  if (!hr) hr = new Date(timestamp).getUTCHours();
  if (!min) min = new Date(timestamp).getUTCMinutes();

  return new Date(Date.UTC(year, month, date, hr, min));
}

function getTimestampForTimeOfDay(dayTimestamp, hr, min) {
  //format time in hh:mm:ss as a string
  return Date.parse(getUTC(dayTimestamp, { hr: hr, min: min }));
}

/*
-Randomly generates a task object
 -{
    name: string, 
    start: timestamp, 
    end: timestamp, 
    location: string, 
    contact: string, 
    points: integer, 
    important: boolean,
    goal: integer,
    attained: integer,
    notes: string,
    file_upload_path: string
  } 
  - more info on the keys in comments within function and below.

-props 
  -start: array of 2 timestamps. start[0] is the latest start time desired; start[1] is the minimum desired.
  -taskLength: array of up to 2 time lengths in milliseconds, if taskLength[1] is ommited it will default to 0. taskLength[0] is the longest time desired; taskLength[1] the minimum. Must be positive.
  -taskNames: an array of strings. Names of tasks desired to be performed.
  -locations: an array of strings. Locations desired for the task to be performed. 
  -notes: a string. Notes associated with the task. (Also associated with creating a random file path, which will grab random words from the "notes" to create said file path.)
*/
function generateTask(
  start,
  taskLength,
  taskNames = [
    "Wallow in self pity",
    "Stare into the abyss",
    "Solve world hunger, tell no one",
    "Jazzercise",
    "Dinner with me",
    "Wrestle with me self loathing",
    "Lay in bed, stare at the ceiling, and slip slowly into madness",
  ],
  locations = [
    "75001 Paris, France",
    "Athens 105 58, Greece",
    "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India",
    "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
    "Eixample, 08013 Barcelona, Spain",
    "08680, Peru",
    "8CHV+9P Uum Sayhoun, Jordan",
  ],
  notes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
) {
  const entry = new Object();

  entry.name = taskNames[randomNumber(taskNames.length)];
  entry.start = start;
  entry.end = start + randomNumber(taskLength[0], taskLength[1]);
  entry.location = null;
  if (randomNumber(2) !== 0)
    entry.location = locations[randomNumber(locations.length)];

  //contact information
  entry.contact = null;
  if (randomNumber(2) !== 0)
    entry.contact = `555-${randomNumber(10)}${randomNumber(10)}${randomNumber(
      10
    )}${randomNumber(10)}`;

  //base points earned upon successful completion
  entry.points = pointGenerator();

  //flag for high priority task
  entry.important = false;
  if (randomNumber(7) > 5) entry.important = true;

  //goal, if not null, allows for relative point bonus or reduction by setting a baseline for completion. Relative change = (attained - Math.abs(goal))/goal. For attained that exceeds or meets goal, new point total = points + relative change * points * point_adjustment. For attained that lags behind goal, new point total = relative change * points / point_adjuster. A negative value of goal is used for cases where user wishes attained to be less than goal. Goal cannot be 0.
  entry.goal = null;
  if (randomNumber(3) > 0) {
    entry.goal = randomNumber(10, 1);
  }
  //attained, used to evaluate task completion. attained value meanings positive-success/partial success, 0-failure, null-yet to reach end timestamp. Not implemented, but might use in the future: negative-partial failure to 0 goal.
  entry.attained = null;
  if (entry.end < today && randomNumber(3) > 0 && entry.goal)
    entry.attained = randomNumber(10);
  else if (entry.end < today && randomNumber(3) > 0) entry.attained = 1;
  else if (entry.end < today) entry.attained = 0;
  if (entry.goal) entry.point_adjustment = randomFloat(5, 0.25);
  entry.notes = null;
  if (randomNumber(5) === 4) entry.notes = notes;

  //path for locally sourced file associated with task.
  entry.file_upload_path = null;
  if (randomNumber(5) === 4) {
    const pathLength = randomNumber(5, 1);
    const filePath = [];
    const filePaths = notes
      .toLowerCase()
      .replaceAll(".", "")
      .replaceAll(",", "")
      .split(" ");
    for (let i = 0; i < pathLength; i++) {
      filePath.push(filePaths[randomNumber(filePaths.length)]);
    }
    entry.file_upload_path = "/" + filePath.join("/");
  }
  return entry;
}

//populates the holidays.json fixture.
function populateHolidays(country = "US") {
  const hd = new Holidays(country);
  const date_columns = ["date", "name"];
  const data = [];
  console.log(today);

  for (let date = todayMinus2Wks; date <= todayPlus5Yrs; date += yearInMs) {
    //For some reason date-holidays package shows holidays a day late.
    const year = new Date(date).getUTCFullYear();
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

  writeFile("holidays", data);
}

//Randomly generates multiple single-use generic tasks and returns them in an array.
function populateTasks() {
  console.log(getUTC(today));
  // const task_columns = [
  //   "name",
  //   "start",
  //   "end",
  //   "location",
  //   "contact",
  //   "points",
  //   "important",
  //   "goal",
  //   "attained",
  //   "point_adjustment",
  //   "notes",
  //   "file_upload_path",
  //   "repeat", will be undefined for this function used in later functions
  //   "group", will be undefined for this function used in later functions
  // ];

  const data = [];

  for (let i = todayMinus6Months; i < today + yearInMs; i += dayInMs) {
    //chance to skip day
    if (randomNumber(5) < 2) continue;
    const timestampEOD = getTimestampForTimeOfDay(i, 23, 59);
    for (let j = 0; j < 10; j++) {
      //chance to skip making a task, should avg 3-4 tasks per day
      if (randomNumber(3) > 0) continue;
      data.push(
        generateTask(
          randomNumber(timestampEOD, i),
          randomNumber(dayInMs * 7, minuteInMs * 15)
        )
      );
    }
  }
  return data;
}

//Generates repetitive semi-random tasks with the repeat method selected using the list below and a switch. Returns an array of the tasks.
function populateRepeatedTasks() {
  /*repeat methods: 
  0_daily-select repeat based on days of the week, can have one or multiple repeats per week
  1_weekly-repeats based on what week in the month it is, can specify a day for instance the first saturday
  2_monthly-can be first, last, or a selected day(s) in a month
  3_quarterly-select a day(s) within 4 3 month blocks.
  4_yearly- select one or multiple days to repeat a task a year
  5_custom- select a number of days between tasks, min 1
  6_disabled- they had a task as repeated, but turned it off, saves previous settings.
  */
  const data = { tasks: [], repeated: [] };

  const taskNames = [
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "yearly",
    "custom",
    "secondQuarterly",
  ];

  const implement = { start: null, end: null };
  let repeatValues = [];
  const initialTimestamps = [];
  let taskLength = 0;

  //initial should be a timestamp and taskLength in milliseconds.
  const newEnd = (initial) => initial + taskLength;

  //an array of task objects, with the position in the array corresponding with the repeat method.
  const repeatedTasks = taskNames.map((taskName) =>
    generateTask(today, randomNumber(60, 15) * minuteInMs, [taskName])
  );

  //randomly chooses when the repeated tasks will be implemented and ended. The minimum difference between implement start and end increases with larger increases between tasks.
  function getImplementStartEnd(i) {
    implement.start = randomNumber(today, today - weekInMs * 3);
    implement.end = randomNumber(
      todayPlus5Yrs,
      Math.floor(implement.start + dayInMs * 30 * 2.3 ** i)
    );
  }

  function getTaskLength(i) {
    taskLength = repeatedTasks[i].end - repeatedTasks[i].start;
  }

  function getRequiredValues(i) {
    getImplementStartEnd(i);
    getTaskLength(i);
  }

  /*
    -Gets the date for a desired day of the week (Sun-Sat) the first instance after the initialDate set point (isCountingBackwards = false) or (isCountingBackwards = true) last instance before a given initial date.
    -desiredDay is the day of the week ranging from 0-6 for Sunday-Saturday that is wanted.
    -initialDate is the date of the start point for finding the desired day of the week.
    -isCountingBackwards is used when trying to get the last instance of a day of the week prior to initialDate (generally used to get the last instance in a given month, in this case initialDate should be the last day in the month).
    -Returns the date.
  */

  function getDateOfDesiredDay(
    desiredDay,
    initialDate,
    isCountingBackwards = false
  ) {
    const referencedDay = initialDate.getUTCDay();
    let referencedDate = initialDate.getUTCDate();
    const difference = desiredDay - referencedDay;
    if (!difference) return initialDate;
    if (isCountingBackwards) referencedDate -= 7;
    const desiredDate = difference + referencedDate;
    if (difference > 0)
      return getUTC(Date.parse(initialDate), { date: desiredDate });
    if (difference < 0)
      return getUTC(Date.parse(initialDate), { date: desiredDate + 7 });
  }

  //returns the date of the last day of the given timestamp and month defined. Works by subtracting 24 hrs from the first day of the next month.
  function getLastDayOfMonth(timestamp, month) {
    const timestampDate = new Date(timestamp);
    if (!month) month = timestampDate.getUTCMonth();
    return getUTC(timestamp, { month: month + 1, date: 1, hr: -24 });
  }

  function goToNextMonth(timestamp) {
    const timestampDate = new Date(timestamp);
    let date = getUTC(timestamp, {
      month: timestampDate.getUTCMonth() + 1,
    });
    //changes the date to the last day of the month if timestamp.getUTCDate() > the following month's last day
    if (timestampDate.getUTCMonth() + 1 !== date.getUTCMonth()) {
      date = getLastDayOfMonth(timestamp, timestampDate.getUTCMonth() + 1);
    }
    return date;
  }

  function goToNextYear(timestamp) {
    const timestampDate = new Date(timestamp);
    let date = getUTC(timestamp, { year: timestampDate.getUTCFullYear() + 1 });
    //changes the date to the last day of the month if timestamp.getUTCDate() > the following month's last day
    if (timestampDate.getUTCMonth() + 1 === date.getUTCMonth()) {
      date = getLastDayOfMonth(Date.parse(date), timestampDate.getUTCMonth());
    }
    return date;
  }

  //gets date of first instance of desired day.
  function get1stInstanceOfDay(timestamp, day) {
    return getDateOfDesiredDay(day, getUTC(timestamp, { date: 1 }));
  }

  //gets the date of the instance needed
  function getIterationOfDayNeeded(timestamp, instance, day) {
    return getUTC(timestamp, {
      date:
        get1stInstanceOfDay(timestamp, day).getUTCDate() + (instance - 1) * 7,
    });
  }

  //sets repeatedTasks[i].start to the next month's iteration
  function setNextMonthsIteration(timestamp, week, day) {
    return Date.parse(
      getIterationOfDayNeeded(Date.parse(goToNextMonth(timestamp)), week, day)
    );
  }

  function generateRepeatedTasks(i) {
    switch (i) {
      //daily repeat method
      case 0: {
        getRequiredValues(i);
        //days in the week
        repeatValues = [1, 5];
        const repeatTimes = [
          { hr: 8, min: 0 },
          { hr: 15, min: 0 },
        ];

        data.repeated.push({
          id: i,
          implement_start: implement.start,
          implement_end: implement.end,
          repeat_method: i,
          repeat_values: repeatValues,
        });

        //finds the initial timestamps for the assigned days that immmediately follow implement.start
        for (j = 0; j < repeatValues.length; j++) {
          initialTimestamps[j] = Date.parse(
            getUTC(implement.start, {
              date: getDateOfDesiredDay(
                repeatValues[j],
                getUTC(implement.start)
              ).getUTCDate(),
              hr: repeatTimes[j].hr,
              min: repeatTimes[j].min,
            })
          );
        }
        initialTimestamps.sort((a, b) => a - b);

        //Loops a push to data array for each repeatValue until implement.repeatedTasks[i].end is reached
        for (let k = 0; k < initialTimestamps.length; k++) {
          repeatedTasks[i].start = initialTimestamps[k];
          repeatedTasks[i].end = newEnd(repeatedTasks[i].start);
          while (repeatedTasks[i].start < implement.end) {
            const { start, end } = repeatedTasks[i];
            data.tasks.push({ ...repeatedTasks[i], start: start, end: end });
            repeatedTasks[i].start += weekInMs;
            repeatedTasks[i].end = newEnd(repeatedTasks[i].start);
          }
        }
        break;
      }

      // weekly repeat method
      case 1: {
        getRequiredValues(i);
        repeatValues = [3];
        data.repeated.push({
          id: i,
          implement_start: implement.start,
          implement_end: implement.end,
          repeat_method: i,
          repeat_values: repeatValues,
        });

        (repeatedTasks[i].start = implement.start + dayInMs),
          (repeatedTasks[i].end = newEnd(repeatedTasks[i].start));
        while (repeatedTasks[i].start < implement.end) {
          const { start, end } = repeatedTasks[i];
          data.tasks.push({ ...repeatedTasks[i], start: start, end: end });
          repeatedTasks[i].start += weekInMs * repeatValues[0];
          repeatedTasks[i].end = newEnd(repeatedTasks[i].start);
        }
        break;
      }

      //monthly repeat method
      case 2: {
        //If use for app, will need to figure out conversions for timezone.

        getRequiredValues(i);

        //repeatValues[0]: a given day of the month; repeatValues[1]: a given iteration of a given day of a month, e.g. 2nd Tuesday of the month, with [0] being the week and [1] being the day.
        repeatValues = [
          randomNumber(31 + 1, 1),
          [randomNumber(4 + 1, 1), randomNumber(7)],
        ];

        data.repeated.push({
          id: i,
          implement_start: implement.start,
          implement_end: implement.end,
          repeat_method: i,
          repeat_values: repeatValues,
        });

        //repeat for a given date, repeatValues[0]
        const setStartEnd = (newStart) => {
          if (!Number.isInteger(newStart))
            repeatedTasks[i].start = Date.parse(newStart);
          else repeatedTasks[i].start = newStart;
          repeatedTasks[i].end = newEnd(repeatedTasks[i].start);
        };

        //gets timestamp for initial task.
        setStartEnd(getUTC(implement.start, { date: repeatValues[0] }));

        //checks that implement start is before task start. If not adds a month to the initial task so that it'll fall after implement.start.
        if (new Date(implement.start).getUTCDate() > repeatedTasks[i].start)
          setStartEnd(
            getUTC(repeatedTasks[i].start, {
              month: goToNextMonth(repeatedTasks[i].start),
              date: repeatValues[0],
            })
          );

        while (repeatedTasks[i].start < implement.end) {
          const { start, end } = repeatedTasks[i];
          data.tasks.push({ ...repeatedTasks[i], start: start, end: end });
          setStartEnd(goToNextMonth(repeatedTasks[i].start));
        }

        //repeat for a given iteration of a given day, repeatValues[1]
        repeatedTasks[i] = generateTask(
          today,
          today + randomNumber(60, 15) * minuteInMs,
          ["secondMonthly"]
        );
        getRequiredValues(i);

        setStartEnd(
          getIterationOfDayNeeded(
            implement.start,
            repeatValues[1][0],
            repeatValues[1][1]
          )
        );

        //checks if implement start is before initial instance, if not moves the instance forward a month.
        if (implement.start > repeatedTasks[i].start) {
          repeatedTasks[i].start = setNextMonthsIteration(
            repeatedTasks[i].start,
            repeatValues[1][0],
            repeatValues[1][1]
          );
        }

        while (repeatedTasks[i].start < implement.end) {
          const { start, end } = repeatedTasks[i];
          data.tasks.push({ ...repeatedTasks[i], start: start, end: end });
          setStartEnd(
            setNextMonthsIteration(
              repeatedTasks[i].start,
              repeatValues[1][0],
              repeatValues[1][1]
            )
          );
        }
        break;
      }

      //Quarterly repeat
      case 3: {
        //Returns random date within a given quarter
        getRequiredValues(i);
        const setStartEnd = (newStart) => {
          if (!Number.isInteger(newStart))
            repeatedTasks[i].start = Date.parse(newStart);
          else repeatedTasks[i].start = newStart;
          repeatedTasks[i].end = newEnd(repeatedTasks[i].start);
        };

        //due to date being based on how many days have passed for the year, getUTC starts at the beginnning of the year
        function getRepeatValuesDate(date) {
          return getUTC(implement.start, {
            year: new Date(implement.start).getUTCFullYear(),
            month: 0,
            date: date,
          });
        }

        function getRepeatValuesDay() {
          return {
            month: randomNumber(5, 1),
            week: randomNumber(5, 1),
            day: randomNumber(7),
          };
        }

        /*
        repeatValues[0]: a given date of the quarter.

        repeatValues[1]: a given day of the week of a given week of a given month, e.g. 2nd Tuesday of February for Q1.
        */
        repeatValues = [
          //choosing a random day over the course of a quarter, q2 and beyond has an extra day for the minimum to skip potential leap day in q1
          {
            q1: randomNumber(91, 1),
            q2: randomNumber(92 + 91, 92),
            q3: randomNumber(92 + 91 + 93, 92 + 92),
            q4: randomNumber(92 + 91 + 93 + 93, 92 + 92 + 93),
          },
          {
            q1: getRepeatValuesDay(),
            q2: getRepeatValuesDay(),
            q3: getRepeatValuesDay(),
            q4: getRepeatValuesDay(),
          },
        ];

        data.repeated.push({
          id: i,
          implement_start: implement.start,
          implement_end: implement.end,
          repeat_method: i,
          repeat_values: repeatValues,
        });

        for (const [key, value] of Object.entries(repeatValues[0])) {
          repeatValues[0][key] = Date.parse(getRepeatValuesDate(value));
        }

        //Quarterly repeat a given date of the quarter, repeatValues[0]
        for (const value of Object.values(repeatValues[0])) {
          setStartEnd(value);
          if (implement.start > repeatedTasks[i].start)
            setStartEnd(goToNextYear(repeatedTasks[i].start));
          while (repeatedTasks[i].start < implement.end) {
            const { start, end } = repeatedTasks[i];
            data.tasks.push({ ...repeatedTasks[i], start: start, end: end });
            setStartEnd(goToNextYear(repeatedTasks[i].start));
          }
        }

        //Quarterly repeat a given day of a given week of a month in the quarter, repeatValues[1]
        function getQuarterlyRepeats(
          timestamp,
          quarter,
          values = getRepeatValuesDay()
        ) {
          const { month, week, day } = values;
          const yearMonth = Date.parse(
            //The x - 1 in the following equation is due to purposely making january in getRepeatValuesDay() a nonzero number for the sake of the following algebra.
            getUTC(timestamp, { month: month * quarter - 1, date: 1 })
          );
          return Date.parse(
            getUTC(getIterationOfDayNeeded(yearMonth, week, day))
          );
        }

        let quarter = 0;
        repeatedTasks[i].taskName = taskNames[6];

        for (const value of Object.values(repeatValues[1])) {
          quarter++;

          setStartEnd(getQuarterlyRepeats(implement.start, quarter, value));

          if (implement.start > repeatedTasks[i].start)
            setStartEnd(
              getQuarterlyRepeats(
                goToNextYear(repeatedTasks[i].start),
                quarter,
                value
              )
            );

          while (repeatedTasks[i].start < implement.end) {
            const { start, end } = repeatedTasks[i];
            data.tasks.push({ ...repeatedTasks[i], start: start, end: end });
            setStartEnd(
              getQuarterlyRepeats(
                goToNextYear(repeatedTasks[i].start),
                quarter,
                value
              )
            );
          }
        }
        break;
      }

      //yearly repeats
      case 4: {
        getRequiredValues(i);
        const setStartEnd = (newStart) => {
          if (!Number.isInteger(newStart))
            repeatedTasks[i].start = Date.parse(newStart);
          else repeatedTasks[i].start = newStart;
          repeatedTasks[i].end = newEnd(repeatedTasks[i].start);
        };
        setStartEnd(
          getUTC(implement.start, { month: 0, date: randomNumber(365, 1) })
        );

        if (
          new Date(repeatedTasks[i].start).getUTCMonth() == 1 &&
          new Date(repeatedTasks[i].start).getUTCDate() == 29
        )
          setStartEnd(
            repeatedTasks[i].start.parse(repeatedTasks[i].start) + dayInMs
          );

        data.repeated.push({
          id: i,
          implement_start: implement.start,
          implement_end: implement.end,
          repeat_method: i,
          repeat_values: `${new Date(
            repeatedTasks[i].start
          ).getUTCMonth()}-${new Date(repeatedTasks[i].start).getUTCDate()}`,
        });

        if (implement.start > repeatedTasks[i].start)
          setStartEnd(goToNextYear(repeatedTasks[i].start));
        while (repeatedTasks[i].start < implement.end) {
          const { start, end } = repeatedTasks[i];
          data.tasks.push({ ...repeatedTasks[i], start: start, end: end });
          setStartEnd(goToNextYear(repeatedTasks[i].start));
        }
        break;
      }

      //custom interval in days
      case 5: {
        getRequiredValues(i);
        const setStartEnd = (newStart) => {
          if (!Number.isInteger(newStart))
            repeatedTasks[i].start = Date.parse(newStart);
          else repeatedTasks[i].start = newStart;
          repeatedTasks[i].end = newEnd(repeatedTasks[i].start);
        };
        const interval = randomNumber(100, 35) * dayInMs;
        setStartEnd(implement.start);

        data.repeated.push({
          id: i,
          implement_start: implement.start,
          implement_end: implement.end,
          repeat_method: i,
          repeat_values: interval,
        });

        while (repeatedTasks[i].start < implement.end) {
          const { start, end } = repeatedTasks[i];
          data.tasks.push({ ...repeatedTasks[i], start: start, end: end });
          setStartEnd((repeatedTasks[i].start += interval));
        }
      }
    }
  }
  for (let i = 0; i < 6; i++) {
    generateRepeatedTasks(i);
  }
  return data;
}

function populateGroupedTasks() {
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
      console.log("Repeated tasks have been populated in fixture");
    }
  );
}

function populateTaskList() {
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
      console.log("Task list has been populated in fixture");
    }
  );
}

function generateTaskSet(
  taskParams = { task: null, repeated: null, grouped: null }
) {
  const { task } = taskParams;

  if (!task) {
    generateTask();
    task = {
      ...task,
      repeated: repeated.id,
      grouped: grouped.id,
    };
  }

  const defaultTask = { task_length: task.end - task.start };

  for (let [key, value] of Object.entries(taskParams.task)) {
    if (key == "end" || key == "attained") continue;
    defaultTask = { ...defaultTask, key: value };
  }

  return { ...taskParams, default: defaultTask };
}

function populateTaskSet(set) {}

function populateTimedEvents() {}

const date_schedule_columns = ["date", "task_name"];

const calendar_info = ["start_calendar", "end_calendar", "last_login"];

switch (process.argv[2]) {
  case "populateHolidays": {
    populateHolidays();
    break;
  }
  case "populateTasks": {
    const data = populateTasks();
    writeFile("tasks", data);
    break;
  }

  case "populateRepeatedTasks": {
    const data = populateRepeatedTasks();
    writeFile("repeated_tasks", data.repeated);
    writeFile("tasks", data.tasks);
    break;
  }

  case "all": {
    const data = populateRepeatedTasks();
    data.tasks.push(populateTasks());
    writeFile("repeated_tasks", data.repeated);
    writeFile("tasks", data.tasks);
    break;
  }

  default: {
    break;
  }
}

module.exports = {
  populateHolidays,
  populateTasks,
};
