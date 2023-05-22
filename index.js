const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const mongoString = process.env.DATABASE_URL;
const PORT = 3500;
mongoose.connect(mongoString);
const database = mongoose.connection;

app.use(cors());
app.use(express.json());
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const user_route = require("./routes/routes");

database.on("error", (error) => console.error(error));

database.once("connected", () => console.log("Databse connected"));

app.use("/users", user_route);
app.get("/", (req, res) => {
  res.send("Hi, I am Live now!");
});

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`I am listening on ${PORT}`);
    });
  } catch (error) {
    logError(error);
  }
};

start();
