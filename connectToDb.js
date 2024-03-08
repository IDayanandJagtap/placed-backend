const mongoose = require("mongoose");

const connectToDb = async () => {
    mongoose
        .connect("mongodb://127.0.0.1:27017/placement")
        .then((value) => {
            console.log("Connected to Db");
        })
        .catch((err) => {
            console.log("Failed connecting with db : ", err);
        });
};

connectToDb();
