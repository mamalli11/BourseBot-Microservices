const { default: mongoose } = require("mongoose");

mongoose.connect("mongodb://localhost:27017/db-services", (error) => {
    if (!error) return console.log("connected to mongodb > db-services ✔");
    console.log("Error: can not connect to mongodb > db-services ❌");
});
