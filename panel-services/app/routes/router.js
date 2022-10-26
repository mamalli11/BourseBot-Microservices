const router = require("express").Router();

const { checkLogin } = require("../http/Middlewares/auth");

const { ClientRoutes } = require("./V1/client.routes");
const { AdminRoutes } = require("./V1/admin.routes");

router.use("/", ClientRoutes);
router.use("/dashboard", checkLogin, AdminRoutes);

module.exports = { Routes: router }