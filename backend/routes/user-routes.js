const express = require("express");
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser } = require("../controllers/user-controller");
const protect = require("../middleware/auth-middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);
router.get("/loginstatus", loginStatus);
router.patch("/updateuser", protect, updateUser);

module.exports = router;