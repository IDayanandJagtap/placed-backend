const mongoose = require("mongoose");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@blogin.qxgxfni.mongodb.net/?retryWrites=true&w=majority`;

const connectToDb = async () => {
    mongoose
        .connect(process.env.MONGO_PASS)
        .then((value) => {
            console.log("Connected to Db");
        })
        .catch((err) => {
            console.log("Failed connecting with db : ", err);
        });
};

connectToDb();
