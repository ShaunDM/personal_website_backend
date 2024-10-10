const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function calendarExists(req, res, next) {
  const { year, month, date } = req.params;
  const foundCalendar = await service.read(`${year}${month}`);
  const foundDate = await service.readDate(date);
  if (foundCalendar) {
    res.locals.calendar = foundCalendar;
    return next();
  }
  next({
    status: 404,
    message: `Calendar for ${month}/${year} was not found!`,
  });
}

module.exports = {
  read: asyncErrorBoundary(calendarExists),
};
