const mongoose = require("mongoose");

CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  industry: String,
});

module.exports = mongoose.model("Customer", CustomerSchema);
