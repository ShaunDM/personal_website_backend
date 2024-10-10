const cors = require("cors");
const router = require("express").Router();
const controller = require("./calendar.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const corsGet = cors({ method: "GET" });

router
  .route("/:year/:month/:day")
  .get(corsGet, controller.read)
  .options(corsGet)
  .all(methodNotAllowed);

router
  .route("/:year/:month")
  .get(corsGet, controller.read)
  .options(corsGet)
  .all(methodNotAllowed);

module.exports = router;
