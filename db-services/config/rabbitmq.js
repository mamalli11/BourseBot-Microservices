const amqp = require("amqplib");

const Companies = require("../models/Companies");
const Category = require("../models/Category");


let channel;

const connectTochannel = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        console.log("Connected to rabbitmq server ✔");
        return await connection.createChannel();
    } catch (error) {
        console.log("cannot connect to rabbitmq server");
    }
};

const returnChannel = async () => {
    if (!channel) {
        channel = await connectTochannel();
    }
    return channel;
};

const createQueue = async (queueName) => {
    const channel = await returnChannel();
    await channel.assertQueue(queueName);
    return channel;
};

const pushToQueue = async (queueName, data) => {
    try {
        await channel.assertQueue(queueName);
        return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error.message);
    }
};

const processingRequestsQueue = async (queueName) => {
    await createQueue(queueName);
    channel.consume(queueName, async (msg) => {
        if (msg.content) {
            const { Request, Type, Body } = JSON.parse(msg.content.toString());
            let Data;
            switch (Request) {
                case 'Companies':
                    Data = await handelReqCompanies(Type, Body)
                    break;
                case 'Groups':
                    Data = await handelReqGroups(Type, Body)
                    break;
                case 'Scraping':
                    Data = await handelReqScraping(Type, Body)
                    break;
                default:
                    Data = "NOT Defined"
                    break;
            }

            channel.ack(msg);
            pushToQueue(Request + Type, { Data });
            console.log(`sended ${Request} Type :${Type}  ✔`);
        }
    });
};

const handelReqScraping = async (Type, data) => {
    try {
        switch (Type) {
            case 'Craete': {
                let catID = await Category.findOne({ categoryName: data.category[0] })
                if (!catID) {
                    catID = await Category.create({
                        categoryName: data.category[0],
                        subCategoryName: data.category[1],
                    })
                }
                await Companies.create({ ...data, categoryID: catID, });
                return 'companie Created!';
            } case 'Update': {
                const companie = await Companies.findById(data);
                return companie;
            }
            default:
                return 'داده ای یافت نشد';
        }
    } catch (error) {
        console.log(error);
    }
}

const handelReqCompanies = async (Type, data) => {
    switch (Type) {
        case 'All': {
            const companies = await Companies.find();
            return companies;
        } case 'FindById': {
            const companie = await Companies.findById(data);
            return companie;
        } case 'FindByName': {
            const companie = await Companies.findOne({ symbol: data });
            return companie;
        } case 'Search': {
            const companie = await Companies.find({ symbol: { $regex: data } });
            return companie;
        }
        default:
            return 'داده ای یافت نشد';
    }
}

const handelReqGroups = async (Type, data) => {
    switch (Type) {
        case 'All': {
            const groups = await Category.find();
            return groups;
        } case 'FindById': {
            const group = await Category.findById(data);
            return group;
        } case 'FindByName': {
            const group = await Category.findOne({ GroupName: data });
            return group;
        }
        default:
            return 'داده ای یافت نشد';
    }
}

module.exports = {
    returnChannel,
    pushToQueue,
    connectTochannel,
    createQueue,
    processingRequestsQueue,
};
