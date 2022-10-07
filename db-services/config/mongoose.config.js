const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://localhost:27017/bot_db", (error) => {
    if (!error) return console.log("connected to db-services DB!");
    console.log("Error: can not connect to db-services");
});
