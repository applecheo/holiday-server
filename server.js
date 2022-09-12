require("dotenv").config();
const log = require("debug")("holidays:server");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT ?? 3000;
const app = express();
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (err) =>
  console.log(err.message + " is MongodB not running?")
);
mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));
mongoose.connection.once("open", () => {
  console.log("connected to mongoose...");
});

app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send({ msg: "Holidays" });
});

app.listen(PORT, () => {
  log(`Express listing on ${PORT}`);
});
