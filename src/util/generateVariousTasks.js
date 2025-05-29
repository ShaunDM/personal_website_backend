import {
  minInMs,
  hrInMs,
  dayInMs,
  wkInMs,
  yrsInMs,
} from "./millisecondTimeConversions";

/*
 "id": unique id for database reference
  "name": user given name of the task, will require it to be unique for default parameter reference.
  "start": timestamp for the start time of a task.
  "points": integer, base points awarded for completing task. If set to 0, will omit points section when listed.
  "goal": string representing an integer or float, benchmark to decide how the base points will be adjusted after completion. A negative value will represent a countdown to be met or finished before. 0 will indicate success when a task is not performed. Null indicates no goal. A positive value will indicate a number to be reached.
  "important": boolean, whether or not a task is important. Will change highlighting and notifications. 
  "default_id": reference to default parameters to allow for quick creation of new tasks under the same name.
*/
const requiredTaskKeys = [
  "id",
  "name",
  "start",
  "points",
  "goal",
  "important",
  "default_id",
];

/*
  "end": timestamp for the end of a task. Null indicates the task is a general task.
  "attained": string representing an integer or float, what user accomplished for a given task, used with goal and bonus to calculate how base points are augmented.
  "bonus": string representing an integer or float, A negative value indicates the user should fall below the goal; a positive value represents the user should exceed the goal, for additional points. A float indicates multiplication, an int indicates addition of bonus.
  "contact": string, contact information relavent to the task.
  "location": string, location relavent to the task.
  "notes": text box, notes relavent for the task.
  "attachment": file or filepath for an attachment.
  "alert": an array of timestamps, if this becomes an app, sets an alarm for the task a given amount of time before it begins.
  "private": boolean, if this becomes an app, will hide tasks set to private if their calendar is shared with other users.
  "repeated": if the task is a repeated task, references the id of the repeated task.
  "grouped": if the task is a grouped task, references the ids of the tasks grouped with this one. Grouped tasks goal and bonuses are based on tasks completed within the group and not this individual task.
*/

const possibleTaskKeys = [
  "end",
  "attained",
  "bonus",
  "contact",
  "location",
  "notes",
  "attachment",
  "alert",
  "private",
  "repeated",
  "grouped",
];

const locations = [
  "75001 Paris, France",
  "Athens 105 58, Greece",
  "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001, India",
  "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
  "Eixample, 08013 Barcelona, Spain",
  "08680, Peru",
  "8CHV+9P Uum Sayhoun, Jordan",
];

const notes = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

const allTaskKeys = [...requiredTaskKeys, ...possibleTaskKeys];

//generates a random integer up to max - 1 and above the min, min is 0 by default.
function randomNumber(max, min = 0) {
  let number = Math.floor(Math.random() * (max - min) + min);
  if (number === max) number--;
  return number;
}

//generates a random float to the hundredths place up to max - .01 and above the min, min is 0 by default.
function randomFloat(max, min = 0) {
  let number = Math.random() * (max - min) + min;
  if (number === max) number--;
  return number.toFixed(2);
}

function getTimeFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes()}`;
}

//selects a random number in increments of 10 from 10 to 100.
function pointGenerator() {
  return (Math.floor(Math.random() * 9) + 1) * 10;
}

//checks the required task keys for standard, general, and grouped tasks
function checkRequiredTaskKeys(task) {
  for (const [key, value] of Object.entries(task)) {
    if (requiredTaskKeys.includes(key) && value != undefined) continue;
    if (possibleTaskKeys.includes(key)) continue;
    if (key == "default_id" && value === null) continue;
    throw new Error(`New task lacks key value pair: ${key}`);
  }
}

//generates a default entry for a given task.
function generateDefault(newTask, id) {
  if (!id)
    throw new Error(
      "id required for generateDefault() in generateVariousTasks."
    );
  checkRequiredTaskKeys(newTask);
  delete newTask.attained;
  delete newTask.id;
  return { ...newTask, id: id };
}

/*
-generateTask takes a partial or empty given newTask and completes it with a degree of randomness to the variable paramaters.
-newTask is an object with all of the requiredTaskKeys array as keys and some of the possibleTaskKeys array as usable keys. repeated and grouped keys are for a separate kind of task generating function. 
-A unique id value should be used.
-for more info on the keys see the arrays above where they are listed.
*/

function generateTask(newTask = {}) {
  for (let i = 0; i < allTaskKeys.length; i++) {
    if (!newTask.hasOwnProperty(allTaskKeys[i]))
      newTask[allTaskKeys[i]] = undefined;
  }
  for (let [key, value] of Object.entries(newTask)) {
    if (value != undefined) continue;
    switch (key) {
      case "id": {
        throw new Error("A unique id is required for generating a task.");
      }
      case "name": {
        newTask[key] = `standard task ${taskId}`;
        break;
      }
      case "start": {
        newTask[key] = randomNumber(Date.now() + dayInMs, Date.now());
        break;
      }
      case "end": {
        newTask[key] = newTask.start + minInMs * 15 * randomNumber(8, 1);
        break;
      }
      case "alert": {
        const alerts = [
          0,
          minInMs * 15,
          minInMs * 30,
          hrInMs,
          hrInMs * 2,
          dayInMs,
          wkInMs,
          wkInMs * 2,
        ];
        if (randomNumber(5) === 4)
          newTask[key] = newTask.start - alerts[randomNumber(alerts.length)];
        break;
      }
      case "points": {
        newTask[key] = pointGenerator();
        break;
      }
      case "goal": {
        if (randomNumber(3) === 2) {
          newTask[key] = randomFloat(7);
          if (randomNumber(2) === 1) newTask[key] *= -1;
        }
        break;
      }
      case "attained": {
        if (Date.now > newTask.end && newTask.goal != null)
          newTask[key] = randomFloat(Math.abs(newTask[goal]));
      }
      case "bonus": {
        if (!newTask.goal) {
          break;
        }
        if (randomNumber(2) === 1) newTask[key] = pointGenerator();
        else newTask[key] = randomFloat(2, 0.5);
        break;
      }
      case "important": {
        if (randomNumber(5) === 4) newTask[key] = true;
        else newTask[key] = false;
        break;
      }
      case "change_default": {
        break;
      }
      case "contact": {
        if (randomNumber(5) === 4)
          newTask[key] = `555-${randomNumber(10)}-${randomNumber(
            10
          )}-${randomNumber(10)}-${randomNumber(10)}`;
        break;
      }
      case "location": {
        if (randomNumber(3) === 2)
          newTask[key] = locations[randomNumber(locations.length)];
        break;
      }
      case "notes": {
        if (randomNumber(6) === 5)
          newTask[key] = notes[randomNumber(notes.length)];
        break;
      }
      case "attachment": {
        if (randomNumber(10) == 9) {
          const note = notes[randomNumber(notes.length)].split(" ");
          newTask[key] = `/${note[randomNumber(note.length)]}`;
        }
        break;
      }
      case "private": {
        if (randomNumber(7) === 6) newTask[key] = true;
        else newTask[key] = false;
        break;
      }
      case "repeated": {
        break;
      }
      case "grouped": {
        break;
      }
      default: {
        throw new Error(`Standard task key not found: ${key}`);
      }
    }
  }
}

/*
-generateRepeatedTask creates the settings necessary to repeat a given task ad infinum with random parameters for some of the key:value pairs.
-newTask is the task object to be repeated, see generateTask() for more info
-repeated is an object that defines how and when the task is repeated. 
  *implement is an object that defines the start and end of the repitition.
  *method defines the overall interval between repitions, the time scale of the repition.
  *values define the specific dates and/or specific interval utilized for the method defined.
-repeat methods:
  0:daily-select repeat based on days of the week, can have one or multiple repeats per week
  1:weekly-repeats every x weeks on y day of the week.
  2:monthly-can be a given date in a month (if the date falls after the last day of the month it will occur on that months last day) or a given iteration of a given day of a month with a range of 1-4, e.g. 2nd Tuesday of the month.
  3:quarterly-follows a similar scheme as monthly where dates can be selected within 4 3 month blocks or a given iteration is selected for the quarter with a range of 1-3 for the month selected: e.g. The 4th Sunday of the 3rd month in the quarter.
  4:yearly- select one or multiple dates to repeat a task a year
  5:custom- select a number of days between tasks, min 1.
  6:disabled- they had a task as repeated, but turned it off; saves settings, but doesn't generate more tasks.
*/
function generateRepeatedTask(
  newTask = {
    default_id: undefined,
    implemenent_start: undefined,
    implemenent_end: undefined,
    method: randomNumber(6),
    values: undefined,
  }
) {
  //Randomly selects implement_end with minimum duration exponentially increasing with the method used.
  function generateImplementEnd(method, start) {
    return randomNumber(
      Date.now() + yrsInMs(5),
      Math.floor(start + dayInMs * 30 * 2.3 ** method)
    );
  }

  //randomly selects implement_start and implement_end and returns them as object implement with keys of start and end.
  function generateImplementStartEnd(method) {
    const implement = {};
    implement.start = randomNumber(Date.now(), Date.now() - wkInMs * 3);
    implement.end = generateImplementEnd(method);
    return implement;
  }

  //gets the  date for a given timestamp with the possibility of partially defined parameters outside of the timestamp. fullDate is an object with undefined parameters utilizing the timestamp for their values, while defined parameters replace those for the timestamp. Returns a new Date.
  function getDate(
    timestamp,
    fullDate = {
      year: new Date(timestamp).getFullYear(),
      month: new Date(timestamp).getMonth(),
      date: new Date(timestamp).getDate(),
      hr: new Date(timestamp).getHours(),
      min: new Date(timestamp).getMinutes(),
    }
  ) {
    let { year, month, date, hr, min } = fullDate;
    if (!year) year = new Date(timestamp).getFullYear();
    if (!month) month = new Date(timestamp).getMonth();
    if (!date) date = new Date(timestamp).getDate();
    if (!hr) hr = new Date(timestamp).getHours();
    if (!min) min = new Date(timestamp).getMinutes();

    return new Date(year, month, date, hr, min);
  }

  //randomly generates the values needed for the repeat method used
  function generateRepeatValues(method) {
    switch (method) {
      //daily repeat method
      case 0: {
        //days in the week
        return [
          { day: randomNumber(7), hr: randomNumber(12, 6), min: 0 },
          { day: randomNumber(7), hr: randomNumber(20, 12), min: 30 },
        ];
      }

      // weekly repeat method, repeats every x weeks.
      case 1: {
        return [
          {
            week: randomNumber(7, 5),
            day: randomNumber(7),
            hr: randomNumber(20, 6),
            min: 0,
          },
          {
            week: randomNumber(4),
            day: randomNumber(7),
            hr: randomNumber(20, 6),
            min: 0,
          },
        ];
      }

      //monthly repeat method
      case 2: {
        //values[0]: a given date in a the month; values[1]: a given iteration of a given day of a month, e.g. 2nd Tuesday of the month.
        return [
          { date: randomNumber(29, 1), hr: randomNumber(21, 6), min: 0 },
          {
            week: randomNumber(5, 1),
            day: randomNumber(7),
            hr: randomNumber(21, 6),
            min: 0,
          },
        ];
      }

      //Quarterly repeat
      case 3: {
        //randomly selects an iteration of the quarter to repeat, e.g. 1st Wednesday of the 2nd month of the quarter.

        function getRepeatValuesDay(q) {
          return {
            month: randomNumber(4, 1) + (q - 1) * 3,
            week: randomNumber(5, 1),
            day: randomNumber(7),
          };
        }

        /*
        values[0]: a given date of the quarter.
        values[1]: a given day of the week of a given week of a given month, e.g. 2nd Tuesday of February for Q1.
        */
        return [
          //choosing a random day over the course of a quarter, q2 and beyond has an extra day for the minimum to skip potential leap day in q1
          {
            q1: getDate(Date.now(), {
              month: 0,
              date: randomNumber(91, 1),
              hr: randomNumber(20, 6),
              min: 0,
            }),
            q2: getDate(Date.now(), {
              month: 0,
              date: randomNumber(92 + 91, 92),
              hr: randomNumber(20, 6),
              min: 0,
            }),
            q3: getDate(Date.now(), {
              month: 0,
              date: randomNumber(92 + 91 + 93, 92 + 92),
              hr: randomNumber(20, 6),
              min: 0,
            }),
            q4: getDate(Date.now(), {
              month: 0,
              date: randomNumber(92 + 91 + 93 + 93, 92 + 92 + 93),
              hr: randomNumber(20, 6),
              min: 0,
            }),
          },
          {
            q1: getRepeatValuesDay(1),
            q2: getRepeatValuesDay(2),
            q3: getRepeatValuesDay(3),
            q4: getRepeatValuesDay(4),
          },
        ];
      }

      //yearly repeats
      case 4: {
        return [
          getDate(Date.now, {
            month: 0,
            date: randomNumber(182, 1),
            hr: randomNumber(20, 6),
            min: 0,
          }),
          getDate(Date.now, {
            month: 0,
            date: randomNumber(365, 182),
            hr: randomNumber(20, 6),
            min: 0,
          }),
        ];
      }

      //custom interval in days
      case 5: {
        return [randomNumber(100, 35) * dayInMs, randomNumber(7, 2)];
      }
      //disabled repeated task
      case 6: {
        const randomMethod = randomNumber(6);
        return {
          method: randomMethod,
          values: generateRepeatValues(randomMethod),
        };
      }
      default: {
        if (!method) {
          Object.assign(newTask.method, randomNumber(6));
          generateRepeatedTask({
            newTask,
          });
          break;
        }
        throw new Error(
          `Method: ${method}, is not an available option, method should be an integer in the range of 0 to 6. Origin: generateVariousTasks/generateRepeatValues`
        );
      }
    }
  }

  const repeatedKeys = [
    "default_id",
    "implement_start",
    "implement_end",
    "repeat_method",
    "repeat_values",
  ];

  //checks that all needed keys exist, if not adds them with the value set to null.
  for (let i = 0; i < repeatedKeys.length; i++) {
    if (!newTask.hasOwnProperty(repeatedKeys[i]))
      newTask[repeatedKeys[i]] = null;
  }
  //goes through each key:value pair and, if needed, randomly generates a value for that key.
  for (let [key, value] of Object.entries(newTask)) {
    if (value != undefined) continue;
    switch (key) {
      case "default_id": {
        throw new Error(
          `key: ${key} requires a value for creating a repeated task.`
        );
      }
      case "implement_start": {
        if (!newTask.method)
          throw new Error("Need repeat method for generating a repeated task.");
        if (!newTask.implement_start && newTask.implement_end) {
          console.error(
            "Has implement_end with no implement_start, randomly generating both instead."
          );
        }
        const implement = generateImplementStartEnd(newTask.method);
        newTask.implement_start = implement.start;
        newTask.implement_end = implement.end;
        break;
      }
      case "implement_end": {
        //implement_end with a value of null is valid and will continue generating tasks indefinitely.
        if (newTask[key] === null) break;
        newTask[key] = generateImplementEnd(
          newTask.implement_start,
          newTask.method
        );
        break;
      }
      case "repeat_method":
        /*repeat methods:
          0:daily-select repeat based on days of the week, can have one or multiple repeats per week
          1:weekly-repeats every x weeks on y day of the week.
          2:monthly-can be a given date in a month (if the date falls after the last day of the month it will occur on that month's last day) or a given iteration of a given day of a month with a range of 1-4, e.g. 2nd Tuesday of the month.
          3:quarterly-follows a similar scheme as monthly where dates can be selected within 4 3 month blocks or a given iteration is selected for the quarter with a range of 1-3 for the month selected: e.g. The 4th Sunday of the 3rd month in the quarter.
          4:yearly- select one or multiple dates to repeat a task a year
          5:custom- select a number of days between tasks, min 1.
          6:disabled- they had a task as repeated, but turned it off; saves settings, but doesn't generate more tasks.
        */
        if (!newTask.method)
          throw new Error("Need repeat method for generating a repeated task.");
        break;
      case "repeat_values": {
        newTask[key] = generateRepeatValues(newTask.method);
      }
      default: {
        throw new Error(`Repeated task key not found: ${key}`);
      }
    }
  }
  return newTask;
}

function generateGroupedTask(newTask) {
  const groupedTask = generateTask(newTask);
  for (let i = 0; i < randomNumber(5, 2); i++) {
    groupedTask.grouped.push(generateTask());
  }
  return groupedTask;
}

function generateGeneralTask(newTask) {
  const generalTask = generateTask(newTask);
  return { ...generalTask, end: null };
}

export {
  generateTask,
  generateGeneralTask,
  generateRepeatedTask,
  generateGroupedTask,
  generateDefault,
};
