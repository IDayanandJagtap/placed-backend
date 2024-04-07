const express = require("express");
const app = express();
const port = 8000;
require("dotenv").config();
const cors = require("cors");
const path = require("path");

//connect to db
require("./connectToDb");

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/student"));

app.get("/", async (req, res) => {
    res.send("Hellooo , Welcome to coding world");
});

app.listen(port, () => {
    console.log("running on port : " + port);
});
