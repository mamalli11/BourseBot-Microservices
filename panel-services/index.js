const path = require("path");

const express = require("express");
require("dotenv").config();

const { createOrderWithQueue } = require("./config/rabbitmq");
// createOrderWithQueue("PANEL");

const { setHeaders } = require("./app/middlewares/headers");
const { errorHandler } = require("./app/middlewares/errors");

const app = express();

//* Static Folder
app.use("/public", express.static(path.join(__dirname, "public")));

//* View Engine
app.set("view engine", "ejs");
app.set("views", "views");

//* BodyPaser
app.use(setHeaders);

//* Routes
app.use("/", require("./app/routes/index").indexRouter);
app.use("/api", require("./app/routes/payment").paymentRouter);

//* 404 Page
app.use(require("./app/Controllers/errorController").get404);

//* Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Server running in => http://localhost:${PORT} ✔`));
