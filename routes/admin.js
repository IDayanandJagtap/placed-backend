const express = require("express");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const Company = require("../models/Company");
const Job = require("../models/Jobs");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const Notification = require("../models/Notification");
const verifyUser = require("../middleware/verifyUser");

//! Insights
router.get("/insights", async (req, res) => {
    try {
        const companies = await Company.find({}, { _id: 1 });
        const jobs = await Job.find({}, { _id: 1 });
        const students = await Student.find({}, { _id: 1 });

        const data = [
            { name: "Students", number: students.length },
            { name: "Companies", number: companies.length },
            { name: "Jobs", number: jobs.length },
        ];

        res.status(200).json({ success: true, data: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! approve
router.post("/approve", verifyUser, async (req, res) => {
    try {
        const { id, userType } = req.body;
        const User = userType == "student" ? Student : Company;

        // Check if the client is admin
        const isAdmin = await Admin.findById(req.user.id);

        if (!isAdmin) {
            return res
                .status(401)
                .json({ success: false, error: "Unauthorised user" });
        }

        const approveUser = await User.findByIdAndUpdate(id, {
            isVerified: true,
        });

        if (!approveUser) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }

        // okay
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Reject
router.post("/reject", verifyUser, async (req, res) => {
    try {
        const { id, userType } = req.body;
        const User = userType.toLowerCase() == "student" ? Student : Company;

        // Check if the client is admin
        const isAdmin = await Admin.findById(req.user.id);

        if (!isAdmin) {
            return res
                .status(401)
                .json({ success: false, error: "Unauthorised user" });
        }
        console.log(req.body);
        const rejectUser = await User.findByIdAndDelete(id);

        if (!rejectUser) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }

        // okay
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Invalidate (unapprove)
router.post("/invalidate", verifyUser, async (req, res) => {
    try {
        const { id, userType } = req.body;
        const User = userType == "student" ? Student : Company;

        // Check if the client is admin
        const isAdmin = await Admin.findById(req.user.id);

        if (!isAdmin) {
            return res
                .status(401)
                .json({ success: false, error: "Unauthorised user" });
        }

        const approveUser = await User.findByIdAndUpdate(id, {
            isVerified: false,
        });

        if (!approveUser) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }

        // okay
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Update profile
router.post("/update", verifyUser, async (req, res) => {
    try {
        const { name, designation } = req.body;

        const { id } = req.user;

        const isAdmin = await Admin.findById(id);

        if (!isAdmin) {
            return res
                .status(400)
                .json({ success: false, error: "User doesn't exist" });
        }

        const updatedAdmin = {
            name,
            designation,
        };

        //  Find and update the admin

        const admin = await Admin.findOneAndUpdate({ _id: id }, updatedAdmin, {
            new: true,
        });

        // admin updated ... send the response
        res.status(200).json({ success: true, data: admin });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Create new admin
router.post("/register", verifyUser, async (req, res) => {
    try {
        const { name, email, password, designation } = req.body;
        const { id } = req.user;

        const isAdmin = await Admin.findById(id);

        if (!isAdmin) {
            return res
                .status(400)
                .json({ success: false, error: "User doesn't exist" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //  create admin

        const admin = await Admin.create({
            name,
            designation,
            email,
            password: hashedPassword,
        });

        if (!admin) {
            throw new Error("Something went wrong!");
        }

        // admin updated ... send the response
        res.status(200).json({ success: true, data: admin });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post("/del", async (req, res) => {
    const pass = await bcrypt.hash(req.body.pass, 10);
    res.send(pass);
});

//! Get unverified users
router.get("/getunverified", verifyUser, async (req, res) => {
    try {
        const students = await Student.find({ isVerified: false });
        const companies = await Company.find({ isVerified: false });

        res.status(200).json({ success: true, data: { students, companies } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! ********  NOTIFICATIONS ************

//! 1. new notification
router.post("/notifications/new", verifyUser, async (req, res) => {
    try {
        const { description } = req.body;

        const isAdmin = await Admin.findById(req.user.id);

        if (!isAdmin) {
            return res
                .status(400)
                .json({ success: false, error: "User doesn't exist" });
        }

        const notification = await Notification.create({
            description,
            adminName: isAdmin.name,
        });

        if (!notification) {
            throw new Error("Something went wrong!");
        }

        // Created... send the response
        res.status(201).json({ success: true, data: notification });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Get all notifications
router.get("/notifications", async (req, res) => {
    try {
        const notifications = await Notification.find({});

        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

//! Delete a notification
router.delete("/notifications/delete/:id", verifyUser, async (req, res) => {
    try {
        const id = req.params.id;
        const isAdmin = await Admin.findById(req.user.id);

        if (!isAdmin) {
            return res
                .status(400)
                .json({ success: false, error: "User doesn't exist" });
        }

        const notifications = await Notification.findByIdAndDelete(id);

        if (!notifications) {
            throw new Error("Something went wrong");
        }

        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
