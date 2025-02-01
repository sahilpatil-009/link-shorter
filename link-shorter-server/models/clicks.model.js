const mongoose = require("mongoose");

const UserClicksSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link", 
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set the timestamp to the current time
  },
  ipAddress: {  
    type: String,
    required: true, // Store the user's IP address
  },
  userDevice: {
    type: String,
    required: true,
  },
  originalLink: {
    type: String,
    required: true, // Store the original link
  },
  shortLink: {
    type: String,
    required: true, // Store the short link
  },
},{ timestamps: true });

const Clicks = mongoose.model("Clicks", UserClicksSchema);
module.exports = Clicks;
