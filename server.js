require("dotenv").config();
const log = require("debug")("holidays:server");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send({ msg: "Holidays" });
});

app.listen(PORT, () => {
  log(`Express listing on ${PORT}`);
});
