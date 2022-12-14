const amqp = require("amqplib");
const { v4: uuidv4 } = require('uuid');

let channel;
let uuid = uuidv4();

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

const createQueue = async (queueName, options) => {
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

const pushToRPCQueue = async (queueName, data) => {
    try {
        const assertedQueue = await channel.assertQueue("", { exclusive: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
            replyTo: assertedQueue.queue,
            correlationId: uuid
        });
        return { assertedQueue, channel };

    } catch (error) {
        console.log(error);
    }
};

const createPanelQueue = async (queueName) => {
    await createQueue(queueName);
    // channel.consume(queueName, async (msg) => {
    //     if (msg.content) {
    //         const { products, userEmail } = JSON.parse(msg.content.toString());
    //         const newOrder = new orderModel({
    //             products,
    //             userEmail,
    //             totalPrice: products.map((p) => +p.price).reduce((prev, curr) => prev + curr, 0),
    //         });
    //         await newOrder.save();
    //         channel.ack(msg);
    //         pushToQueue("PRODUCT", newOrder);
    //         console.log("saved order : ", newOrder._id);
    //     }
    // });
};

module.exports = {
    returnChannel,
    pushToQueue,
    pushToRPCQueue,
    connectTochannel,
    createQueue,
    createPanelQueue,
};
