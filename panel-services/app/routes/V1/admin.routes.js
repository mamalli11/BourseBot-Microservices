const router = require("express").Router();

const { DashboardRouter } = require("./Admin/dashboard");
// const { ProductsRouter } = require("./Admin/products");

router.use("/", DashboardRouter);
// router.use("/Products", ProductsRouter);

module.exports = { AdminRoutes: router };
