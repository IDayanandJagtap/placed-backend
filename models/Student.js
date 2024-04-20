const mongoose = require("mongoose");

// We cannot have required fields because for signup we will only get partial values.
const StudentModel = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    degree: String,
    year: String,
    imgUrl: String,
    resumeUrl: String,
    portfolio: String,
    achievements: String,
    phone: String,
    skills: [],
    academics: [],
    contact: {},
    isVerified: { type: Boolean, default: false },
    joinedDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Student", StudentModel);
