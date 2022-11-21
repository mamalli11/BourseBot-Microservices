const router = require("express").Router();

const { UserController } = require("../../../http/controllers/Auth/user.controller");

const { authenticated } = require("../../../http/Middlewares/auth");

//^  @desc   Login Page
//&  @route  GET /users/login
router.get("/login", UserController.loginPage);

//^  @desc   Login Handle
//&  @route  POST /users/login
router.post("/login", UserController.handleLogin, UserController.rememberMe);

//^  @desc   Logout Handle
//&  @route  GET /users/logout
router.get("/logout", authenticated, UserController.logout);

module.exports = { UserRouter: router };
