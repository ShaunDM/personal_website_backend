function notFound(req, res, next) {
  next({ status: 404, message: `Path: ${req.originalUrl} not found` });
}

module.exports = notFound;
