const mongoose = require("mongoose");

const permissionsSchmea = new mongoose.Schema(
    {

        name: { type: String, trim: true, unique: true, minlength: 3, maxlength: 50, required: true },
        description: { type: String, trim: true, default: '', maxlength: 50 },
    },
    {
        timestamps: true,
        versionKey: false
    }
);


module.exports = mongoose.model("Permissions", permissionsSchmea);
