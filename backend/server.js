const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/user-routes"); 
const errorHandler = require("./middleware/error-middleware");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Routes Middleware
app.use("/api/users", userRoute);


// Routes
app.get("/", (req, res) => {
    res.send("Home Page::Welcome from server");
});

// Error Middleware
app.use(errorHandler);

// DB and server connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});