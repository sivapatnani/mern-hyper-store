const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "1d"});
};

// Register user
const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;

    //validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please add all required fields");
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

    // Generate user token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1-day
        sameSite: "none",
        secure: true
    });

    if (user) {
        const { _id, name, email, photo, phone, bio} = user;
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data and registration failed.");
    }
});

// Login user
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    //validation
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add all required fields");
    }
    if (password.length < 3) {
        res.status(400);
        throw new Error("Password must be minimum 3 characters");
    }

    // Check if user exists
    const user = await User.findOne({email});
    if (!user) {
        res.status(400);
        throw new Error("User not found, please signup");
    }

    // Generate user token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
           path: "/",
           httpOnly: true,
           expires: new Date(Date.now() + 1000 * 86400), //1-day
           sameSite: "none",
           secure: true
    });

    // User exists, check if password is correct
    const isValidPass = await bcrypt.compare(password, user.password);
    if (isValidPass) {
        const { _id, name, email, photo, phone, bio} = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        });
    } else {
        res.status(400);
        throw new Error("Invalid password, try again.");
    }
});

// Logout user
const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({
        message: "Successfully logged out"
    });
});

// Get user
const getUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
        const { _id, name, email, photo, phone, bio} = user;
        return res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio
        });
    } else {
        res.status(400);
        throw new Error("User not found.");
    }
});

// User login status
const loginStatus = asyncHandler(async(req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json(false);
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
        return res.json(true);
    }
    return res.json(false); 
});

//Update user
const updateUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        const { name, email, photo, phone, bio} = user;
        user.email = email;
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio
        })
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser
};