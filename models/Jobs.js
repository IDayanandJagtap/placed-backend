const mongoose = require("mongoose");

const JobsModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    companyName: String,
    type: String,
    description: {
        type: String,
        required: true,
    },
    skills: [String],
    salaryRange: {},
    isOpen: Boolean,
    postedDate: {
        type: Date,
        default: Date.now(),
    },
    appliedStudents: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
            description: String,
        },
    ],
});

module.exports = mongoose.model("Job", JobsModel);
