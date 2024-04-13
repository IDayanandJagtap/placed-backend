const express = require("express");
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("node:fs/promises");
const Company = require("../models/Company");
const Student = require("../models/Student");
const Job = require("../models/Jobs");
const verifyUser = require("../middleware/verifyUser");

//! Get all jobs :
router.get("/jobs/getall", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json({ success: true, data: jobs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Get one
router.get("/jobs/getone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);

        const students = await Student.aggregate([
            {
                $match: {
                    _id: {
                        $in: job.appliedStudents.map((student) => student.id),
                    },
                },
            },
        ]).exec();
        // map students and their description and delete unneccessary fields to reduce network call size.
        students.forEach((e, i) => {
            e.jobDescription = job.appliedStudents[i].description;
            // delete other fields
            delete e.email;
            delete e.password;
            delete e.resumeUrl;
            delete e.achievements;
            delete e.academics;
            delete e.contact;
            delete e.joinedDate;
            delete e.imgUrl;
            delete e.phone;
        });

        res.status(200).json({ success: true, data: { job, students } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
