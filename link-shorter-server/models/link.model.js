const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  originalLink: {
    type: String,
    required: true,
  },
  remark :{
    type:String,
    required: true,
  },
  shortLink: {
    type: String,
    required: true,
  },
  expireDate: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activeStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  totalClicks: {
    type: Number,
    default: 0,
  },
  dateClicks: [
    {
      date: { type: String },
      count: { type: Number, default: 0 },
    },
  ],
  deviceClicks: {
    mobile: { type: Number, default: 0 },
    desktop: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
  },
}, {timestamps: true});

// set activeStatus based on expireDate
LinkSchema.pre("save", function (next) {
  const today = new Date();

  // If expireDate is set and has passed, set status to Inactive
  if (this.expireDate && this.expireDate < today) {
    this.activeStatus = "Inactive";
  } else {
    this.activeStatus = "Active";
  }

  next();
});

const Link = mongoose.model("Link", LinkSchema);
module.exports = Link;
