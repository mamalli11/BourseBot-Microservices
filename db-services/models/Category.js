const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        categoryName: { type: String, trim: true, unique: true, required: [true, "نام الزامی می باشد"] },
        subCategoryName: { type: String, trim: true, minlength: 3 },
        aboutIndustry: { type: Number, trim: true, default: "" },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("Category", categorySchema);
