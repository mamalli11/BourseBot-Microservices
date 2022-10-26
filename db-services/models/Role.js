const mongoose = require("mongoose");

const roleSchmea = new mongoose.Schema(
    {

        name: { type: String, trim: true, unique: true, minlength: 3, maxlength: 50, required: true },
        description: { type: String, trim: true, maxlength: 50, default: '' },
        permissions: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Permissions", required: true }
        ],

    },
    {
        timestamps: true,
        versionKey: false
    }
);


module.exports = mongoose.model("Role", roleSchmea);
