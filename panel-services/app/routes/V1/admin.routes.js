const router = require("express").Router();

const { UserRouter } = require("./Admin/user");

// const { DashboardRouter } = require("./Admin/dashboard");
// const { ProductsRouter } = require("./Admin/products");

router.use("/Users", UserRouter);

// router.use("/", DashboardRouter);
// router.use("/Products", ProductsRouter);

module.exports = { AdminRoutes: router };
