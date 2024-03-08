const express = require("express");
const app = express();
const port = 8000;

//connect to db
require("./connectToDb");

app.get("/", async (req, res) => {
    res.send("Hellooo , Welcome to coding world");
});

app.listen(port, () => {
    console.log("running on port : " + port);
});
