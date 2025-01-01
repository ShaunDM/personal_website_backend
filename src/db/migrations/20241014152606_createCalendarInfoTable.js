/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  const today = new Date(Date.now());
  const fiveYearsFromToday = new Date(Date.parse(today) + 157766400000);
  return knex.schema.createTable("calendar_info", (table) => {
    table.date("start_calendar").notNullable().defaultTo(today);
    table.date("end_calendar").notNullable().defaultTo(fiveYearsFromToday);
    table.date("last_login").notNullable().defaultTo(today);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
