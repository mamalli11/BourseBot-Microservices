const { pushToQueue } = require('../config/rabbitmq');

const Companies = require('../models/Companies');
const Users = require('../models/Users');

(async () => {
    const Companieslength = await Companies.find().countDocuments();
    const Userslength = await Users.find().countDocuments();

    if (Companieslength == 0) {
        await pushToQueue("WebScraper", { Type: "All", Body: null });
        console.log("*** Sended Request Scraper All Stock ✔");
    }

    if (Userslength == 0) {
        await Users.create({
            fullname: "محمد جواد مجیدی",
            email: "iman7260@gmail.com",
            phone: "09370001122",
            password: "123qwe",
            isAdmin: true,
        });
        console.log("***** Created User ✔");
    }

    // const com = await Companies.findById('6345e002b797dfc292c51c9e')
    // await pushToQueue("WebScraper", { Type: "One", Body: com });

})()