const mongoose = require("mongoose");

const CompanyModel = new mongoose.Schema({
    name: String,
    tagline: String,
    email: String,

    password: String,

    bio: String,

    imgUrl: String,
    portfolio: String,
    contact: {},

    isVerified: {
        type: Boolean,
        default: false,
    },
    joinedDate: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Company", CompanyModel);
