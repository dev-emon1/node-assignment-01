const express = require("express");
const usersController = require("../controllers/users.controller");
const routes = express.Router();

routes.route("/random").get(usersController.getRandomUser);
routes.route("/all").get(usersController.getAllUser);

routes.route("/save").post(usersController.saveRandomUser);

routes.route("/update/:id").patch(usersController.updateUser);
routes.route("/delete/:id").delete(usersController.deleteUser);

module.exports = routes;
