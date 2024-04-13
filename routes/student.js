const express = require("express");
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("node:fs/promises");
const Student = require("../models/Student");
const Job = require("../models/Jobs");
const verifyUser = require("../middleware/verifyUser");

//! Get all students :
router.get("/students/getall", async (req, res) => {
    try {
        // for now load all students ...
        // load only partial (required) data -> (name, degree, year, skills)
        const students = await Student.find(
            {},
            { name: 1, skills: 1, degree: 1, year: 1 }
        );

        if (!students) {
            throw new Error("Unable to load student data");
        }

        res.status(200).json({ success: true, data: students });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Get student info (for the logged in student)
router.get("/students/getme", verifyUser, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        console.log(req.user.id);
        console.log(student);

        if (!student) {
            return res.status(400).json({
                success: false,
                error: "Unauthorised user",
            });
        }

        res.status(200).json({ success: true, data: student });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Get a single student (for other user type)
router.get("/students/getone/:id", async (req, res) => {
    const studId = req.params.id;

    try {
        const student = await Student.findById(studId);

        if (!student) {
            return res.status(404).json({
                success: false,
                error: "Student with requested id not found",
            });
        }

        res.status(200).json({ success: true, data: student });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Update student
// add a middleware to check whether the student is valid
// also add validations for other text fields
router.post(
    "/students/update",
    verifyUser,
    upload.array("files", 2),
    async (req, res) => {
        try {
            // get images ... store them for a while and then move them to public/image & public/resume folder
            // save them with the name as the _id of that student
            const studentImage = req.files[0];
            const studentResume = req.files[1];

            const {
                name,
                degree,
                year,
                portfolio,
                achievements,
                skills,
                phone,
                academics,
                contact,
            } = JSON.parse(req.body.textData);

            const { id } = req.user;

            const isStudent = await Student.findById(id);

            if (!isStudent) {
                return res
                    .status(400)
                    .json({ success: false, error: "User doesn't exist" });
            }

            const updatedStudent = {
                name,
                degree,
                year,
                portfolio,
                phone,
                achievements,
                skills,
                academics,
                contact,
            };

            if (studentImage) {
                // rename and move the files
                const imageExtension = studentImage.originalname
                    .split(".")
                    .pop();

                const newImageLocation =
                    "student/images/" + id + "." + imageExtension;

                await fs.rename(
                    "uploads/" + studentImage.filename,
                    "public/" + newImageLocation
                ); // because we have to save the link which serves static files ie. host/student/...

                updatedStudent.imgUrl =
                    process.env.HOST_LINK + newImageLocation;
            }
            if (studentResume) {
                const resumeExtension = studentResume.originalname
                    .split(".")
                    .pop();
                const newResumeLocation =
                    "student/resume/" + id + "." + resumeExtension;

                await fs.rename(
                    "uploads/" + studentResume.filename,
                    "public/" + newResumeLocation
                );
                updatedStudent.resumeUrl =
                    process.env.HOST_LINK + newResumeLocation;
            }

            //  Find and update the student

            const student = await Student.findOneAndUpdate(
                { _id: id },
                updatedStudent,
                { new: true }
            );

            // console.log(student);
            // student updated ... send the response
            res.status(200).json({ success: true, data: student });
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, error: err.message });
        }
    }
);

//! Apply to a job
router.post("/students/apply", verifyUser, async (req, res) => {
    try {
        const { jobId, description } = req.body;
        const studentId = req.user.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res
                .status(400)
                .json({ success: false, error: "Job id not valid" });
        }

        // check if already applied :
        for (let i = 0; i < job.appliedStudents.length; i++) {
            if (job.appliedStudents[i].id == studentId) {
                return res.status(200).json({
                    success: false,
                    error: "You have already applied to this job!",
                });
            }
        }

        // if not then apply now
        const appliedStudents = [
            ...job.appliedStudents,
            { id: studentId, description: description },
        ];

        const updatedJob = await Job.findOneAndUpdate(
            { _id: jobId },
            { appliedStudents: appliedStudents },
            { new: true }
        );

        if (!updatedJob) {
            throw new Error("Something went wrong");
        }

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! get all jobs student has applied
router.get("/students/appliedjobs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const jobs = await Job.find(
            {
                appliedStudents: { $elemMatch: { studentId: id } },
            }
            // { appliedStudents: 0 }
        ).exec();

        res.status(200).json({ success: true, data: jobs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Delete student
module.exports = router;
