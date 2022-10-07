const { Telegraf } = require('Telegraf');

require("dotenv").config();

const { initialBot } = require("./bot");

const bot = new Telegraf(process.env.BOT_TOKEN);

initialBot(bot);
