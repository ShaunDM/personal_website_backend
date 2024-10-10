/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("repeated_tasks", (table) => {
    table.string("task_name").primary();
    table.date("start_date");
    table.date("end_date");
    table.time("start_time");
    table.time("end_time");
    table.boolean("important");
    table.string("repeat_method");
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
