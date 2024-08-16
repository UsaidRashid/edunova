const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profilePic : {
    type:String,
  },
  status :{
    type:String,
  },
  workEmail: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  teams: [String],
});

module.exports = mongoose.model("User", userSchema);
