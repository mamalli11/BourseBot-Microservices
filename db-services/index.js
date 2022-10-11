const { processingRequestsQueue } = require("./config/rabbitmq");

require("./config/mongoose.config");

processingRequestsQueue("DB_BOT");

require("./handler/index");
