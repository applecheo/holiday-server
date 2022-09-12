const mongoose = require("mongoose");

const countrySchema = mongoose.Schema({
  title: String,
});

const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
