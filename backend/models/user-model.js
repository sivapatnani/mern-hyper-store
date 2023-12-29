const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please add user name"]
    },
    email: {
        type: String,
        require: [true, "Please add email"],
        unique: true,
        trim: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please add a valid email"
        ]
    },
    password: {
        type: String,
        require: [true, "Please add user password"],
        minLength: [3, "Password length must be minimum 3 characters"]
        // maxLength: [8, "Password length should not exceed 8 characters"]
    },
    photo: {
        type: String,
        require: [true, "Please add user photo"],
        default: "default_pic.jpg"
    },
    phone: {
        type: String,
        default: "+91-"
    },
    bio: {
        type: String,
        maxLength: [250, "Bio should not exceed 250 characters"],
        default: "Bio - "
    }
}, {
    timeStamps: true
});

// Encrypt the password before saving to DB
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;