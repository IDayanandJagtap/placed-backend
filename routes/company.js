const express = require("express");
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("node:fs/promises");
const Company = require("../models/Company");
const Job = require("../models/Jobs");
const verifyUser = require("../middleware/verifyUser");

//! Get all companies :
router.get("/company/getall", async (req, res) => {
    try {
        // load only partial (required) data
        const companies = await Company.find(
            {},
            { name: 1, imgUrl: 1, bio: 1 }
        );

        if (!companies) {
            throw new Error("Unable to load company data");
        }

        res.status(200).json({ success: true, data: companies });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Get company info (for the logged in company)
router.get("/company/getme", verifyUser, async (req, res) => {
    try {
        const company = await Company.findById(req.user.id);

        if (!company) {
            res.status(404).json({
                success: false,
                error: "Company not found",
            });
        }

        res.status(200).json({ success: true, data: company });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Get a single student (for other user type)
router.get("/company/getone/:id", async (req, res) => {
    const companyId = req.params.id;

    try {
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                error: "Company with requested id not found",
            });
        }

        // Get jobs posted by this company !
        const jobs = await Job.find({ companyId: companyId });

        res.status(200).json({ success: true, data: { company, jobs } });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Update Company
router.post(
    "/company/update",
    verifyUser,
    upload.array("files", 1),
    async (req, res) => {
        try {
            let profileImg;
            if (req.files) {
                profileImg = req.files[0];
            }

            const { name, tagline, bio, contact } = JSON.parse(
                req.body.textData
            );

            const { id } = req.user;

            const isCompany = await Company.findById(id);

            if (!isCompany) {
                return res
                    .status(400)
                    .json({ success: false, error: "User doesn't exist" });
            }

            const updatedCompany = {
                name,
                tagline,
                bio,
                contact,
            };

            if (profileImg) {
                // rename and move the files
                const imageExtension = profileImg.originalname.split(".").pop();

                const newImageLocation =
                    "company/images/" + id + "." + imageExtension;

                await fs.rename(
                    "uploads/" + profileImg.filename,
                    "public/" + newImageLocation
                ); // because we have to save the link which serves static files ie. host/student/...

                updatedCompany.imgUrl =
                    process.env.HOST_LINK + newImageLocation;
            }

            //  Find and update the company

            const company = await Company.findOneAndUpdate(
                { _id: id },
                updatedCompany,
                { new: true }
            );

            // student updated ... send the response
            res.status(200).json({ success: true, data: company });
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, error: err.message });
        }
    }
);

//! Get jobs posted by company
router.get("/company/jobs", verifyUser, async (req, res) => {
    const companyId = req.user.id;

    try {
        const jobs = await Job.find({ companyId: companyId });
        // const companyName = await Company.findById(companyId, { name: 1 });
        console.log(jobs.name);
        res.status(200).json({ success: true, data: jobs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

//! post a new job
router.post("/company/newjob", verifyUser, async (req, res) => {
    const companyId = req.user.id;

    try {
        const { title, description, type, skills, salaryRange } = req.body;

        const company = await Company.findById(companyId, { name: 1 });
        const companyName = company.name;
        const newJob = {
            title,
            type,
            companyName,
            companyId,
            description,
            skills,
            salaryRange,
        };

        const job = await Job.create(newJob);

        if (!job) {
            res.status(500).json({
                success: false,
                error: "Something went wrong!",
            });
        }

        res.status(200).json({ success: true, data: job });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
