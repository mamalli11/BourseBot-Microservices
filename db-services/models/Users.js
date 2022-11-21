const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true, trim: true },
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

userSchema.pre("save", function (next) {
    let user = this;

    if (!user.isModified("password")) return next();

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});


module.exports = mongoose.model("Users", userSchema);
