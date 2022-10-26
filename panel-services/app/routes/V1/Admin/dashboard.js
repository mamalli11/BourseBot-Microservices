const router = require("express").Router();

const { DashboardController } = require("../../../http/Controllers/Admin/dashboard.controller");

const { authenticated } = require("../../../http/Middlewares/auth");

//^  @desc   Index Page
//&  @route  GET /
router.get("/", authenticated, DashboardController.index);

module.exports = { DashboardRouter: router };