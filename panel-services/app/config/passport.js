const passport = require("passport");
const { Strategy } = require("passport-local");
const bcrypt = require("bcryptjs");

const { pushToRPCQueue } = require("./rabbitmq");

passport.use(
    new Strategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const { assertedQueue, channel } = await pushToRPCQueue("DB_BOT", {
                Request: "Users", Type: "FindByEmail", Body: email, RPC: true
            });

            channel.consume(assertedQueue.queue, async (msg) => {
                const Data = JSON.parse(msg.content.toString());
                console.log(Data);
                channel.ack(msg);

                if (!Data) {
                    return done(null, false, { message: "کاربری با این ایمیل ثبت نشده" });
                }
                
                const isMatch = await bcrypt.compare(password, Data.password);
                if (isMatch) {
                    return done(null, Data); //req.user
                } else {
                    return done(null, false, {
                        message: "نام کاربری یا کلمه عبور صحیح نمی باشد",
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (id, done) => {
    const { assertedQueue, channel } = await pushToRPCQueue("DB_BOT", {
        Request: "Users", Type: "FindById", Body: id, RPC: true
    });
    channel.consume(assertedQueue.queue, async (msg) => {
        const user = JSON.parse(msg.content.toString());
        channel.ack(msg);
        done(null, user);
    });
});
