/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  /*repeat methods: 
  0_daily-select repeat based on days of the week, can have one or multiple repeats per week
  1_weekly-repeats based on what week in the month it is, can specify a day for instance the first saturday
  2_monthly-can be first, last, or a selected day(s) in a month
  3_quarterly-select a day(s) within 4 3 month blocks.
  4_yearly- select one or multiple days to repeat a task a year
  5_days- select a number of days between tasks
  */
  return knex.schema.createTable("repeated_tasks", (table) => {
    table.increments("repeated_task_id").primary();
    table.string("repeated_task_name").unique().notNullable();
    table.date("implement_start").notNullable();
    table.date("implement_end");
    table.integer("points").notNullable();
    table.smallint("task_length_days").unsigned().defaultTo(null);
    table.time("start_time");
    table.time("end_time");
    table.boolean("important").defaultTo(false);
    table.smallint("repeat_method");
    table.string("repeat_values");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("repeated_tasks");
};
