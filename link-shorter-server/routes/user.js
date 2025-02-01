const express = require("express");
const router = express.Router();
const User = require("../models/user.model.js");
const Link = require("../models/link.model.js");
const Clicks = require("../models/clicks.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.js");

// register new user
router.post("/register", async (req, res) => {
  const { username, email, mobile, password } = req.body;

  if (!username || !email || !mobile || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are Required" });
  }

  try {
    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await User({
      username,
      email,
      mobile,
      password: hashPass,
    });

    await newUser.save();
    res.status(200).json({ success: true, message: "Register Succesfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

// login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All Fields are Required !" });
  }

  try {
    const exist = await User.findOne({ email });
    if (!exist) {
      return res
        .status(404)
        .json({ success: false, message: "User Not found! Please Register" });
    }

    const samePass = await bcrypt.compare(password, exist.password);
    if (!samePass) {
      return res
        .status(500)
        .json({ success: false, message: "Wrong Username OR Password !" });
    }

    const payload = { id: exist._id, username: exist.username };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "12hr",
    });

    // destructure safely userdetails
    const { password: hashPass, ...userDetails } = exist._doc;

    res.status(200).json({
      success: true,
      message: "Login succesfully !",
      token,
      user: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

router.get("/userget", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const exist = await User.findById(userId);
    if (!exist) {
      return res
        .status(400)
        .json({ success: false, message: "User not found !" });
    }

    return res.status(200).json({
      username: exist.username,
      email: exist.email,
      mobile: exist.mobile,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

router.patch("/update", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { username, email, mobile } = req.body;
  try {
    const exist = await User.findById(userId);
    if (!exist) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    await User.findByIdAndUpdate(userId, {
      username,
      email,
      mobile,
    });

    return res
      .status(200)
      .json({ success: true, message: "Updated Succesfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

router.delete("/delete", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }


    // Find all links created by the user
    const userLinks = await Link.find({ user: userId }).distinct("_id");

    // Delete all clicks related to these links
    if (userLinks.length > 0) {
      await Clicks.deleteMany({ link: { $in: userLinks } });
    }

    // Delete all links associated with the user
    await Link.deleteMany({ user: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ success: true, message: "User and all associated data deleted successfully" });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

module.exports = router;
