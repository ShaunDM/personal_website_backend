/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("tasks", (table) => {
    table.string("task_id").primary();
    table.string("task_name");
    table.timestamp("start").notNullable();
    table.timestamp("end").defaultTo(null);
    table.integer("points").notNullable();
    table.boolean("important").defaultTo(false);
    table.boolean("completed").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("tasks");
};
