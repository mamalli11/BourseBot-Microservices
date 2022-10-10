const configurationBot = require("./configurationBot")

module.exports = {
    initialBot: (bot) => {
        new configurationBot(bot).startBot();
    }
}
