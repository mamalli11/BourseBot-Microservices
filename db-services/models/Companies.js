const mongoose = require("mongoose");

const companiesSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            trim: true,
            unique: true,
            required: [true, "نام الزامی می باشد"],
        },
        url: { type: String, trim: true, required: true },
        categoryID: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        market: { type: String, trim: true, required: true },
        date: { type: String, trim: true, required: true },
        percent: { type: String, trim: true },
        change: { type: String, trim: true },
        price: { type: String, trim: true },
        volume: { type: String, trim: true },
        value: { type: String, trim: true },
        openPrice: { type: String, trim: true },
        highPrice: { type: String, trim: true },
        lowPrice: { type: String, trim: true },
        askVolume: { type: String, trim: true },
        askPrice: { type: String, trim: true },
        bidPrice: { type: String, trim: true },
        bidVolume: { type: String, trim: true },
        strategy: { type: String, trim: true },
        volumeSellerPerson: { type: Number, trim: true },
        volumeBuyerPerson: { type: Number, trim: true },
        sellerNumberPerson: { type: Number, trim: true },
        buyerNumberPerson: { type: Number, trim: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Companies", companiesSchema);
