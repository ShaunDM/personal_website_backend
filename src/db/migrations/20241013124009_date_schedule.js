/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("date_schedule", (table) => {
    table.date("date").notNullable();
    table.string("task_name").notNullable();
    table.foreign("date").references("date").inTable("dates");
    table.foreign("task_name").references("task_name").inTable("tasks");
    table.primary(["date", "task_name"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("date_schedule");
};
