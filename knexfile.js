// Update with your config settings.
const path = require("path");
// require("dotenv").config();

// const {
//   NODE_ENV = "development",
//   DEVELOPMENT_DATABASE_URL,
//   PRODUCTION_DATABASE_URL,
// } = process.env;

// const URL =
//   NODE_ENV === "production"
//     ? PRODUCTION_DATABASE_URL
//     : DEVELOPMENT_DATABASE_URL;

const { DATABASE_URL } = process.env;

module.exports = {
  development: {
    client: "postgresql",
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

// module.exports = {
//   development: {
//     client: "postgresql",
//     connection: URL,
//     migrations: {
//       directory: path.join(__dirname, "src", "db", "migrations"),
//     },
//   },

//   staging: {
//     client: "postgresql",
//     connection: {
//       database: "my_db",
//       user: "username",
//       password: "password",
//     },
//     pool: {
//       min: 2,
//       max: 10,
//     },
//     migrations: {
//       tableName: "knex_migrations",
//     },
//   },

//   production: {
//     client: "postgresql",
//     connection: {
//       database: "my_db",
//       user: "username",
//       password: "password",
//     },
//     pool: {
//       min: 2,
//       max: 10,
//     },
//     migrations: {
//       tableName: "knex_migrations",
//     },
//   },
// };
