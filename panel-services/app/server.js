const path = require("path");

const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const expressLayout = require("express-ejs-layouts");

require("dotenv").config();
require("./config/passport"); //* Passport Configuration

const { Routes } = require("./routes/router");

module.exports = class Application {
  #app = express();
  #PORT;
  constructor(PORT) {
    this.#PORT = PORT;
    this.configApplication();
    this.initClientSession();
    this.initTemplateEngine();
    // this.initRabbitMQ();
    this.createServer();
    this.createRoutes();
    this.errorHandling();
  }
  configApplication() {
    this.#app.use(cors()); //* Allow Cross-Origin requests
    this.#app.use(morgan("dev"));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
    this.#app.use(fileUpload()); //* File Upload Middleware

  }
  createServer() {
    this.#app.listen(this.#PORT, () => {
      console.info(`run > http://localhost:${this.#PORT} ✔`);
    });
  }
  initTemplateEngine() {
    this.#app.use(expressLayout);
    this.#app.set("view engine", "ejs");
    this.#app.set("views", "views");
    this.#app.set("layout", "./layouts/dashLayout");
    this.#app.use(function (req, res, next) {
      res.locals = { USER: req.user };
      next();
    });
  }
  initClientSession() {
    this.#app.use(cookieParser("BHLXhOEr9pk9"));
    this.#app.use(
      session({
        secret: "BHLXhOEr9pk9",
        resave: false,
        saveUninitialized: false,
        unset: "destroy",
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
      })
    );
    //* Passport
    this.#app.use(passport.initialize());
    this.#app.use(passport.session());
    this.#app.use(flash()); //* Flash
  }
  initRabbitMQ() {
    const { createOrderWithQueue } = require("./app/config/rabbitmq");
    createOrderWithQueue("PANEL");
  }
  createRoutes() {
    this.#app.use(Routes);
    this.#app.use(require("./http/Controllers/errorController").get404); //* 404 Page
  }
  errorHandling() {
    this.#app.use((error, req, res, next) => {
      error.statusCode = error.statusCode || 500;
      error.status = error.status || "error";
      res.status(error.statusCode).json({
        status: error.status,
        error,
        message: error.message,
        stack: error.stack,
      });
    });
  }
};
