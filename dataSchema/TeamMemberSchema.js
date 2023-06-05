const mongoose = require("mongoose");

const ReactFormDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  position: {
    type: String,
    required:true
  },
  photo: {
    type: String,
  }
});

const teamMember = mongoose.model("teamMember", ReactFormDataSchema);
module.exports = teamMember;
