//require("dotenv").config();

const express = require("express");
const app = express();

const calendarRouter = require("./calendar/calendar.router");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

app.use(express.json());

app.use("/calendar", calendarRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
