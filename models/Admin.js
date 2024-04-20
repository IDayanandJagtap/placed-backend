const mongoose = require("mongoose");

const AdminModel = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
    },
    joinedDate: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Admin", AdminModel);
