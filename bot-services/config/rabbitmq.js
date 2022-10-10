const amqp = require("amqplib");

let channel;

const connectTochannel = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost:5672")
        console.log("Connected to rabbitmq server ✔");
        return await connection.createChannel();
    } catch (error) {
        console.log("cannot connect to rabbitmq server ❌", error);
    }
};
const returnChannel = async () => {
    if (!channel) { channel = await connectTochannel(); }
    return channel;
};
const pushToQueue = async (queueName, data) => {
    try {
        await returnChannel();
        await channel.assertQueue(queueName);
        return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    } catch (error) {
        console.log(error.message);
    }
};
const createQueue = async (queueName) => {
    try {
        let channel = await returnChannel();
        await channel.assertQueue(queueName);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
        return channel;
    } catch (error) {
        console.log("createQueue ❌", error);
    }
};


module.exports = {
    returnChannel,
    pushToQueue,
    connectTochannel,
    createQueue,
};
