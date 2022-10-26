const router = require("express").Router();

const { IndexController } = require("../../../http/Controllers/Client/indexController");

//^  @desc   Index Page
//*  @route  GET /
router.get("/:id", IndexController.index);

//^  @desc   Buy Panel
//*  @route  GET /buy
router.get("/buy/:id/:panel", IndexController.buyPanel);

module.exports = { indexRouter: router };
