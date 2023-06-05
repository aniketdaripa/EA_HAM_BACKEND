const mongoose = require("mongoose");

const ReactFormDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required:true,
    unique: true,
  },
  phNo: {
    type: String,
    required:true,
  },
  passingYear: {
    type: Number,
    required:true
  },
  course: {
    type: String,
    required:true
  },
  branch: {
    type: String,
    required:true
  },
  passWord: {
    type: String,
    required:true
  },
  userType: {
    type: String,
    //"admin" -- "normalClubMembers" -- "normalUser"
    default: "normalUser",
  },
});

const user = mongoose.model("user", ReactFormDataSchema);
module.exports = user;
