const { Router } = require("express");

const routes = Router();

routes.use("/api/v1/users", require("./user.route"));
routes.use("/api/v1/auth", require("./auth.route"));
routes.use("/api/v1/categories", require("./category.route"));

module.exports = routes;
