const configurationBot = require("./configurationBot")

module.exports = {
    initialBot: (bot) => {
        new configurationBot(bot).initReaction();
        new configurationBot(bot).initText();
        new configurationBot(bot).startBot();
    }
}
