const mongoose = require("mongoose");

const CompanyModel = new mongoose.Schema({
    name: String,

    email: String,

    password: String,

    bio: String,

    imgUrl: String,
    portfolio: String,
    socials: [
        {
            name: String,
            value: String,
        },
    ],
    isVerified: Boolean,
    joinedDate: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Company", CompanyModel);
