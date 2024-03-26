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
    description: {
        type: String,
        required: true,
    },
    skills: [String],
    salaryRange: [],
    isOpen: Boolean,
    postedDate: {
        type: Date,
        default: Date.now(),
    },
    appliedStudents: [],
});
