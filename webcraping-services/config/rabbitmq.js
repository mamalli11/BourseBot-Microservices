const amqp = require("amqplib");

const { ScrapeAllStock } = require('../handler/scrapeAllStock');
const { ScrapeStock } = require('../handler/scrapeStock');

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
    if (!channel) { channel = await connectTochannel(); }
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
        console.log(error);
    }
};

const webScraperServices = async (queueName) => {
    try {
        await createQueue(queueName);
        channel.consume(queueName, async (msg) => {
            if (msg.content) {
                const { Type, Body } = JSON.parse(msg.content.toString());
                console.log(`Received ${Type} Body :${Body}  ✔`);
                switch (Type) {
                    case 'All':
                        ScrapeAllStock.main();
                        break;
                    case 'One':
                        ScrapeStock.main(Body);
                        break;
                    default:
                        break;
                }

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    returnChannel,
    pushToQueue,
    connectTochannel,
    createQueue,
    webScraperServices,
};
