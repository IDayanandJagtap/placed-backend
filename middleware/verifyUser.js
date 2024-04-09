const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({ success: false, error: "Unauthorized access" });
    }

    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenData) {
            return res
                .status(401)
                .json({ success: false, error: "Unauthorized access" });
        }

        req.user = tokenData.user;
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Something went wrong",
        });
    }
};

module.exports = verifyUser;
