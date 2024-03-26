const mongoose = require("mongoose");

const FacultyModel = new mongoose.Schema({
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
    imgUrl: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    joinedDate: {
        type: Date,
        default: Date.now(),
    },

    socials: [{ name: { type: String }, value: { type: String } }],
});

module.exports = mongoose.model("Faculty", FacultyModel);
