/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tasks", (table) => {
    table.string("task_name").primary();
    table.date("date").notNullable();
    table.time("start_time");
    table.time("end_time");
    table.integer("points").notNullable();
    table.boolean("important");
    table.boolean("completed");
    table.boolean("repeated");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("tasks");
};
