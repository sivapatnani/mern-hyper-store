
const registerUser = (req, res) => {
    if (!req.body.email) {
        res.status(400); //bad request
        throw new Error("Please add email");
    }
    res.send("Register User");
};

module.exports = {
    registerUser
};