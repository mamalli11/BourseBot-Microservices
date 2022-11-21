const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const planSchmea = new mongoose.Schema(
    {
        Name: { type: String, maxlength: 50, required: true },
        Time: { type: String, required: true },
        Price: { type: String, default: "free" },
        Discount: { type: Number, default: 0 },
        VIP: { type: Boolean, default: false },
        Description: { type: String, trim: true },
        Availabiltity: { type: Boolean, default: true },
        CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

planSchmea.plugin(mongoosePaginate);

module.exports = mongoose.model("Plan", planSchmea);
