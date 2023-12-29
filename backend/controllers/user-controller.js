const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");

const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;

    //validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }
    if (password.length < 3) {
        res.status(400);
        throw new Error("Password must be minimum 3 characters");
    }

    // Check if user email already exists
    const userExists = await User.findOne({email});

    if (userExists) {
        res.status(400);
        throw new Error("User email has already been registered");
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password
    });
    if (user) {
        const { _id, name, email, photo, phone, bio} = user;
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data and registration failed.");
    }
});

module.exports = {
    registerUser
};