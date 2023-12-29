const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const { log } = require("console");

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401);
            throw new Error("Not authorized, please login");
        }

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Get user id from the token
        const user = await User.findById(verified.id).select("-password");
        if (!user) {
            res.status(401);
            throw new Error("User not found!");
        }    
        req.user = user

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, please login");
    }
});

module.exports = protect;