const { pushToQueue } = require('../config/rabbitmq');

const Companies = require('../models/Companies');

(async () => {
    const Companieslength = await Companies.find().countDocuments();

    if (Companieslength == 0) {
        await pushToQueue("WebScraper", { Type: "All", Body: null });
        console.log("*** Sended Request Scraper All Stock ✔");
    }

    // const com = await Companies.findById('6345e002b797dfc292c51c9e')
    // await pushToQueue("WebScraper", { Type: "One", Body: com });

})()