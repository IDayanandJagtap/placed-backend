const mongoose = require("mongoose");

const CompanyModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    imgUrl: String,
    portfolio: String,
    socials: [
        {
            name: { type: String, required: true },
            value: { type: String, required: true },
        },
    ],
    isVerified: Boolean,
    joinedDate: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Company", CompanyModel);
