const express = require("express");
const router = express.Router();
require("dotenv").config();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const Company = require("../models/Company");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const signupFieldValidation = [
    body("email", "Expected an email").isEmail(),
    body("password", "Password length should by more than 5").isLength({
        min: 6,
    }),
];
const loginFieldValidation = [
    body("email", "Expected an email").isEmail(),
    body("password", "Password length should by more than 5").isLength({
        min: 6,
    }),
];

//! 1. Signup
router.post("/signup", signupFieldValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ success: false, error: errors.array() });
        return;
    }
    try {
        const { email, password, userType } = req.body;

        // check if user already exists;
        const User = userType.toLowerCase() === "student" ? Student : Company;
        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            res.status(400).json({
                success: false,
                error: "User already exists",
            });
            return;
        }

        // user not present so create one
        const saltRounds = 10; // password hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newUser = await User.create({
            email,
            password: hashedPassword,
            name: "",
            year: "",
            degree: "",
            skills: [],
            resumeUrl: "",
            achievements: "",
            academics: Array(6).fill(0),
            contact: { github: "", linkedin: "", twitter: "" },
        });

        if (!newUser) throw new Error("Failed to signup");

        // Generate JWT, set cookie and send the response
        const tokenData = {
            user: { id: newUser.id },
        };
        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "3d" });
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.status(201).json({
            success: true,
            msg: "User created successfully",
            data: { userName: "", userEmail: email, userType: userType },
        });
    } catch (e) {
        console.log("Signup Failed : ", e);
        res.status(500).json({
            success: false,
            error: "Failed to signup !",
        });
    }
});

//! 2. Login
router.post("/login", loginFieldValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }

    const { email, password, userType } = req.body;

    try {
        const User = userType.toLowerCase() === "student" ? Student : Company;

        // Find the user
        const user = await User.findOne({ email: email });

        // If user not found
        if (!user) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid credentials" });
        }

        // Validate password
        const isPasswordSame = await bcrypt.compare(password, user.password);
        if (!isPasswordSame) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid credentials" });
        }

        // Generate jwt
        const tokenData = { user: { id: user.id } };
        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: "3d" });
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            msg: "Logged in successfully",
            data: { userName: user.name, userEmail: email, userType: userType },
        });
    } catch (error) {
        console.log("Login Failed : ", error);
        res.status(500).json({
            success: false,
            error: "Failed to Login !",
        });
    }
});

module.exports = router;
