const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        phone: { type: String, default: null, maxlength: 11, trim: true },
        profile: {
            type: String,
            default: "https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png"
        },
        password: { type: String, required: true, minlength: 4, maxlength: 255 },
        gender: { type: String, default: "unknown", enum: ["male", "female", "unknown"] },
        isAdmin: { type: Boolean, default: false },
        role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Users", userSchema);
