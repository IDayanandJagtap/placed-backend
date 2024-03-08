const mongoose = require("mongoose");

const StudentModel = new mongoose.Schema({
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
    degree: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    imgUrl: String,
    resumeUrl: String,
    portfolio: String,
    achievements: String,
    skills: [],
    academics: [],
    contact: [
        {
            name: { type: String, required: true },
            value: { type: String, required: true },
        },
    ],
    isVerfied: Boolean,
});

module.exports = mongoose.model("Student", StudentModel);
