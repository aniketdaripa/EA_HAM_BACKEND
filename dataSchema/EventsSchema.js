const mongoose = require("mongoose");

const ReactFormDataSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDescription: {
    type: String,
    required: true,
  },
  eventRegistrationStartDate: {
    type: Date,
  },
  eventRegistrationEndDate: {
    type: Date,
  },
  eventDate: {
    type: Date,
  },
  eventTime: {
    type: String,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  eventHolderPhNumber: {
    type: String,
  },
  eventPhoto: {
    type: String, /////????yet to modify
  },
  participants: [{ userId: String }],
  collaboration: {
    type: String,
    default: "no",
  },
  rules: {
    type: String,
  },
  igLink: { type: String },
  eventMangers: { type: String },
});

const event = mongoose.model("event", ReactFormDataSchema);
module.exports = event;
