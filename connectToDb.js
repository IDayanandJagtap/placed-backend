const mongoose = require("mongoose");
require("dotenv").config();

const connectToDb = async () => {
    mongoose
        .connect(process.env.MONGODB_URI)
        .then((value) => {
            console.log("Connected to Db");
        })
        .catch((err) => {
            console.log("Failed connecting with db : ", err);
        });
};

connectToDb();
