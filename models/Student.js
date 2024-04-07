const mongoose = require("mongoose");

// We cannot have required fields because for signup we will only get partial values.
const StudentModel = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    degree: String,
    year: Number,
    imgUrl: String,
    resumeUrl: String,
    portfolio: String,
    achievements: String,
    skills: [],
    academics: [],
    socials: [
        {
            name: { type: String },
            value: { type: String },
        },
    ],
    isVerified: Boolean,
    joinedDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Student", StudentModel);
