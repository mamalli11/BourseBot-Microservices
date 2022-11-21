const router = require("express").Router();

const { indexRouter } = require("./Client/index");
const { paymentRouter } = require("./Client/payment");
const { UserRouter } = require("./Client/user");

router.use("/", indexRouter);
router.use("/Users", UserRouter);
router.use("/payment", paymentRouter);

module.exports = { ClientRoutes: router };
