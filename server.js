require("dotenv").config();
const log = require("debug")("holidays:server");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Country = require("./models/Country");
const Holiday = require("./models/Holiday");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT ?? 3000;
const SECRET = process.env.SECRET ?? "mysecret";

const app = express();
const MONGO_URL =
  process.env.MONGO_URL ??
  "mongodb+srv://cheojunjie:123456789asd@cluster0.mhubwks.mongodb.net/storelab";

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
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ msg: "Holidays" });
});

//* Create route for Holidays
app.post("/holidays", async (req, res) => {
  const newHoliday = req.body;
  log("newHoliday %o", newHoliday);

  const { title } = newHoliday;
  const result = await Holiday.find({ title });
  log("results:%d after searching %o", result.length, title);

  if (result.length > 0) {
    log("sending too many message");
    res.json({ msg: "Too many" });
  } else {
    Holiday.create(newHoliday, (error, holiday) => {
      res.json(holiday);
    });
  }
});

//login
app.post("/login", (req, res) => {
  if (req.body.username === "admin") {
    const payload = { name: "simon" };
    const token = jwt.sign(payload, SECRET);
    res.json({ token, msg: "Ok" });
  } else {
    res.json({ msg: "Fail" });
  }
});

app.get("/countries/seed", async (req, res) => {
  const countries = [
    { title: "Singapore" },
    { title: "Italy" },
    { title: "Thailand" },
  ];

  app.get("/countries", async (req, res) => {
    const countries = await Country.find();
    res.json(countries);
  });
  await Country.deleteMany({});

  const result = await Country.insertMany(countries);

  res.json(result);
});

app.get("/countries", async (req, res) => {
  const countries = await Country.find();

  res.json(countries);
});

//all holidays
app.get("/holidays", async (req, res) => {
  const holidays = await Holiday.find();
  res.json(holidays);
});

//delete holiday
// app.delete("/holidays/:id", async (req, res) => {
//   const { id } = req.params;
//   const deleteHoliday = await Holiday.find(id);
//   res.json(deleteHoliday);
//   console.log(deleteHoliday);
// });

app.delete("/holidays/:id", async (req, res) => {
  const { id } = req.params;
  const holiday = await Holiday.findByIdAndDelete(id);
  // res.send(holiday.lean());
  res.json(holiday);
});

app.listen(PORT, () => {
  log(`Express listing on ${PORT}`);
});
