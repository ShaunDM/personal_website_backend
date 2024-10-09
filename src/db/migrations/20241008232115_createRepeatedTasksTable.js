/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("repeatedTasks", (table) => {
    table.string("task_name").primary();
    table.foreign("date").references("start_date").inTable("dates");
    table.foreign("date").references("end_date").inTable("dates");
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
  return knex.schema.dropTable("repeatedTasks");
};
