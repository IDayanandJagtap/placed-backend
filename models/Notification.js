const mongoose = require("mongoose");

const notificationModel = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    adminName: {
        type: String,
    },
    postedDate: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Notification", notificationModel);
