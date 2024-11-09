require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
var options = {
  ssl: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.DATABASE_URL, options);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
app.use(express.json());

const tweets = require("./routes/tweets");
app.use("/tweets", tweets);

app.listen(3000, () => console.log("Server Started"));
