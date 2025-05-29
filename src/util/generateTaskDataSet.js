import {
  generateTask,
  generateGeneralTask,
  generateGroupedTask,
  generateRepeatedTask,
  generateDefault,
} from "./generateVariousTasks";
import { dayInMs } from "./millisecondTimeConversions";

const data = { tasks: [], repeated: [], default: [] };

let taskId = 0;
let defaultId = 0;
const stdTimeline = [Date.now() - dayInMs, Date.now() + dayInMs];

function checkDefaultExists(name) {
  return data.default.find(
    (index) => index.name.toLowerCase() == name.toLowerCase()
  );
}

function pushToData(task) {
  let def = checkDefaultExists(task.name);
  if (!def) {
    def = generateDefault(task, defaultId++);
    data.default.push(def);
  }
  data.tasks.push({ ...task, default_id: def.id });
}

function selectGenerateFunction(type, param) {
  switch (type) {
    case "standard":
      return generateTask(param);
    case "general":
      return generateGeneralTask(param);
    case "grouped":
      return generateGroupedTask(param);
    case "repeated":
      return generateRepeatedTask(param);
    default:
      throw new Error(
        `Task type: ${type} is not an available option. Origin: generateTaskDataSets/selectGenerateFunction`
      );
  }
}

/*-Generates a data set based on the task type desired, available task types are below. Has two modes of operation, if a taskList is given it will generate a dataset off of that, if taskList is not given it will generate a semi random data set based on the other parameters and how generateVariousTask.js operates.
  -type accepts a string for task type.
  -taskList accepts an array of objects to generate a pregiven list of at least partially filled tasks.
    +if a taskList is used, no further params are needed besides type.
  -If no taskList is given all params, besides taskList will be used.
  -timeline is an array of two timestamps, the first should be the start timestamp for the first task to being generated, while the last should be the start timestamp for the last task to be generated.
  -arraySize is an integer that represents the number of tasks that are desired to be generated for the data set.
  -for further info on task types see generateVariousTasks.js.
  -task types:
    "standard",
    "general",
    "grouped",
    "repeated",
    "repeated-grouped",
    "repeated-general",
*/
export default function generateTaskDataSet(
  type = undefined,
  taskList = undefined,
  timeline = stdTimeline,
  arraySize = 3
) {
  if (!type)
    throw new Error("type is a required parameter for generateTaskDataSet");
  if (taskList) {
    for (let i = 0; i < taskList.length; i++) {
      if (!taskList[i].id) taskList[i]["id"] = taskId++;
      pushToData(selectGenerateFunction(type, taskList[i]));
    }
    return data;
  }

  const interval = (timeline[1] - timeline[0]) / (arraySize - 1);
  let taskStart = timeline[0];
  const task = {};

  while (taskStart <= timeline[1]) {
    if (!type.includes("repeated")) {
      pushToData(
        selectGenerateFunction(type, { id: taskId++, start: taskStart })
      );
    } else {
      if (type.includes("grouped")) task = selectGenerateFunction("grouped");
      else if (type.includes("general"))
        task = selectGenerateFunction("general");
      else task = selectGenerateFunction("standard");
      pushToData(task);
      const default_id = data.default.find(
        (element) => task.name == element.name
      ).id;
      data.repeated.push(
        selectGenerateFunction(type, {
          default_id: default_id,
          interval_start: taskStart,
        })
      );
      taskStart += interval;
    }
  }
  return data;
}
