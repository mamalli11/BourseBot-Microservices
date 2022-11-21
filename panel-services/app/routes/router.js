const router = require("express").Router();

const { checkLogin } = require("../http/Middlewares/auth");

const { ClientRoutes } = require("./V1/client.routes");
const { AdminRoutes } = require("./V1/admin.routes");

router.use("/dashboard", checkLogin, AdminRoutes);
router.use("/", ClientRoutes);

module.exports = { Routes: router }