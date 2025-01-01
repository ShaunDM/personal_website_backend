/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tasks", (table) => {
    table.string("task_id").primary();
    table.string("task_name");
    table.date("start_date").notNullable();
    table.date("end_date").defaultTo(null);
    table.time("start_time").defaultTo(null);
    table.time("end_time").defaultTo(null);
    table.integer("points").notNullable();
    table.boolean("important").defaultTo(false);
    table.boolean("completed").defaultTo(false);
    table.integer("repeated_task_id").defaultTo(null);
    table
      .foreign("repeated_task_id")
      .references("repeated_task_id")
      .inTable("repeated_tasks");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("tasks");
};
