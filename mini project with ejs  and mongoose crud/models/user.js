const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/userrecords");

const userschema = mongoose.Schema({
  name: String,
  email: String,
  image: String,
  description: String,
});
module.exports = mongoose.model("user", userschema);
