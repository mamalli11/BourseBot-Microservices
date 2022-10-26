const router = require("express").Router();

const { indexRouter } = require("./Client/index");
const { paymentRouter } = require("./Client/payment");

router.use("/", indexRouter);
router.use("/payment", paymentRouter);

module.exports = { ClientRoutes: router };
