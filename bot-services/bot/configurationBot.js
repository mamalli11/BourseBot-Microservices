const { pushToQueue, createQueue } = require("../config/rabbitmq");
const { startMessage, symbolDetail } = require("../utils/MessageHandler");
const { symbolButtonList, categorizedButtonList, searchButtonList } = require("../utils/Transformer");

module.exports = class configurationBot {
    #bot;
    #isSearch;
    #isComparison;
    #pelan;
    constructor(bot) {
        this.#bot = bot;
        this.#isSearch = false;
        this.#isComparison = false;
    }
    initReaction() {
        this.#bot.start((ctx) => {
            ctx.reply(startMessage(this.#pelan), {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: "🔍 جستجو",
                                callback_data: "null",
                            },
                            {
                                text: "🏢 شرکت ها",
                                callback_data: "null",
                            },
                            {
                                text: "🗂 دسته بندی",
                                callback_data: "categorized_",
                            },
                        ],
                    ],
                },
            });
        });

        this.#bot.on("voice", (ctx) => ctx.reply("😐 عزیزمن اخه مگه من میتونم ویس گوش بدم \nکه ویس می فرستی"));
        this.#bot.on("photo", (ctx) => ctx.reply("😐 عزیزمن اخه مگه من میتونم عکس ببینم \nکه عکس می فرستی"));
        this.#bot.on("video", (ctx) => ctx.reply("😐 عزیزمن اخه مگه من میتونم فیلم ببینم \nکه فیلم می فرستی"));
        this.#bot.on("document", (ctx) => ctx.reply("این فایلی که فرستادی به چه درد من میخوره 🙄"));
        this.#bot.on("location", (ctx) => ctx.reply("اخه من لوکیشن میخوام چیکار 🤦🏻‍♂️"));
        this.#bot.on("animation", (ctx) => ctx.reply("خداا شما اخر منو میکشید 😑 \n این چی چیه اخه برا من فرستادی"));
        this.#bot.on("sticker", (ctx) => ctx.reply("خداا شما اخر منو میکشید 😑 \n استیکر برا چی میفرستی"));
        this.#bot.on("edited_message", (ctx) => ctx.reply("من زرنگ ترم قبل اینکه ویرایش کنی پیامت را خواندم 😎"));
        this.#bot.on("message_auto_delete_timer_changed", (ctx) =>
            ctx.reply("حالا میزاشتی پیام باشه چرا میخوای به پاکی\n انقدر به من بی اعتمادی 😒")
        );
    }
    initText() {
        this.#bot.on("text", async (ctx) => {
            const text = ctx.message.text;
            if (this.#isComparison == false && this.#isSearch == false) {
                if (text == "🔙 بازگشت") {
                    ctx.reply("یکی از گزینه های زیرا انتخاب کنید", {
                        reply_markup: {
                            keyboard: [
                                [
                                    {
                                        text: "🔍 جستجو",
                                        callback_data: "null",
                                    },
                                    {
                                        text: "🏢 شرکت ها",
                                        callback_data: "null",
                                    },
                                    {
                                        text: "🗂 دسته بندی",
                                        callback_data: "categorized_",
                                    },
                                ],
                            ],
                        },
                    });
                } else if (text.length <= 6) {
                    await pushToQueue("DB_BOT", { Request: "Companies", Type: "FindByName", Body: text });
                    const { channel } = await createQueue("CompaniesFindByName");
                    channel.consume("CompaniesFindByName", async (msg) => {
                        const { Data } = JSON.parse(msg.content.toString());
                        channel.ack(msg);
                        if (Data)
                            ctx.reply(symbolDetail(Data), {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: "نمودار سهام",
                                                callback_data: "chart_" + text,
                                            },
                                            {
                                                text: "مقایسه سهام",
                                                callback_data: "question_" + text,
                                            },
                                        ],
                                    ],
                                },
                            });
                    });
                } else if (text === "🏢 شرکت ها") {
                    await pushToQueue("DB_BOT", { Request: "Companies", Type: "All" });
                    const { channel } = await createQueue("CompaniesAll");
                    channel.consume("CompaniesAll", async (msg) => {
                        const { Data } = JSON.parse(msg.content.toString());
                        channel.ack(msg);
                        ctx.reply("لیست سهام توی دکمه ها وجود داره میتونی هرکدومشون رو کلیک کنی تا جزییاتشو ببینی", {
                            reply_markup: {
                                keyboard: await symbolButtonList(Data),
                            },
                        });
                    });
                } else if (text === "🗂 دسته بندی") {
                    await pushToQueue("DB_BOT", { Request: "Groups", Type: "All" });
                    const { channel } = await createQueue("GroupsAll");
                    channel.consume("GroupsAll", async (msg) => {
                        const Data = JSON.parse(msg.content.toString());
                        channel.ack(msg);
                        ctx.reply("برای نمایش جزئیات دسته بندی ", {
                            reply_markup: {
                                keyboard: await categorizedButtonList(Data.Data),
                            },
                        });
                    });
                } else if (text === "🔍 جستجو") {
                    this.#isSearch = true;
                    ctx.reply("برای جستجو لطفا اسم شرکت را ارسال کنید");
                } else {
                    ctx.reply("چی چی میگی 😶");
                }
            } else if (this.#isSearch) {
                await pushToQueue("DB_BOT", { Request: "Companies", Type: "Search", Body: text });
                const { channel } = await createQueue("CompaniesSearch");
                channel.consume("CompaniesSearch", async (msg) => {
                    const { Data } = JSON.parse(msg.content.toString());
                    channel.ack(msg);
                    if (Data) {
                        this.#isSearch = false;
                        ctx.reply("شرکت های یافت شده.", {
                            reply_markup: {
                                keyboard: await searchButtonList(Data),
                            },
                        });
                    } else {
                        ctx.reply("چیزی یافت نشد 🤦🏻‍♂️😑");
                    }
                });
            }
        });
    }
    startBot() {
        this.#bot.launch()
            .then(() => { console.log("Connected To Telegram ✔") })
            .catch((err) => {
                console.log("Con't Connected To Telegram ❌");
                if (err.code === "ETIMEDOUT") {
                    console.log("Check your internet connection ");
                } else {
                    console.log(err);
                }
            });
    }
};
