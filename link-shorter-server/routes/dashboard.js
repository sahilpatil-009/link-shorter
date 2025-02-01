const express = require("express");
const router = express.Router();
const User = require("../models/user.model.js");
const Link = require("../models/link.model.js");
const Clicks = require("../models/clicks.model.js");
const authMiddleware = require("../middleware/auth.js");
const shortid = require("shortid");

// fetch all links data
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  try {
    const exist = await Link.find({ user: userId });
    if (!exist) {
      return res.status(404).json({ success: false, message: "No Data found" });
    }

    // Calculate the totalClicks sum
    const dateWiseClicks = {};
    const deviceWiseClicks = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    };
    let totalClicksSum = 0;

    exist.forEach((link) => {
      totalClicksSum += link.totalClicks;

      link.dateClicks.forEach((dateClick) => {
        const { date, count } = dateClick;

        if (dateWiseClicks[date]) {
          dateWiseClicks[date] += count;
        } else {
          dateWiseClicks[date] = count;
        }
      });
      // Sum up device-wise clicks
      deviceWiseClicks.mobile += link.deviceClicks.mobile;
      deviceWiseClicks.desktop += link.deviceClicks.desktop;
      deviceWiseClicks.tablet += link.deviceClicks.tablet;
    });

    const dateWiseClickArray = Object.entries(dateWiseClicks)
      .map(([date, totalClicksForDate]) => ({
        date,
        totalClicks: totalClicksForDate,
      }))
      .sort((a, b) => b.totalClicks - a.totalClicks);

    const sortedDeviceClicks = Object.entries(deviceWiseClicks)
      .map(([device, count]) => ({ device, clicks: count }))
      .sort((a, b) => b.clicks - a.clicks);

    return res.status(200).json({
      success: true,
      LinkData: exist,
      totalClicks: totalClicksSum,
      dateWiseClicks: dateWiseClickArray,
      deviceWiseClicks: sortedDeviceClicks,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

router.get("/links", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { limit, offset, search } = req.query;
  try {
    const query = { user: userId };
    if (search) {
      query.remark = { $regex: search, $options: "i" }; 
    }

    const today = new Date();

    // Update expired links to "Inactive" before fetching
    await Link.updateMany(
      { user: userId, expireDate: { $lt: today }, activeStatus: "Active" },
      { $set: { activeStatus: "Inactive" } }
    );
    
    const exist = await Link.find(query)
    .skip(Number(offset) || 0)
    .limit(Number(limit) || 10);

    if (!exist) {
      return res.status(404).json({ success: false, message: "No Data found" });
    }

    const count = await Link.countDocuments(exist);
    return res.status(200).json({
      success: true,
      LinkData: exist,
      count,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

// add new link
router.post("/addlink", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { originalLink, remark, expireDate } = req.body;

  if (!originalLink || !remark) {
    return res
      .status(400)
      .json({ success: false, message: "All Fields Required !" });
  }
  try {
    let shortLink = shortid.generate();

    const linkData = {
      originalLink,
      shortLink,
      remark,
      user: userId,
    };

    if (expireDate) {
      linkData.expireDate = new Date(expireDate);
    }

    const newLink = new Link(linkData);
    await newLink.save();

    return res.status(200).json({
      success: true,
      message: "Link added successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

// get all clicks data
router.get("/getClicks", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { limit, offset } = req.query;

  try {
    const userLinks = await Link.find({ user: userId });

    if (!userLinks || userLinks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No links found for this user",
      });
    }

    const userLinksIds = userLinks.map(link => link._id);

    const userClicks = await Clicks.find({ link: { $in: userLinksIds } })
      .skip(Number(offset) || 0)
      .limit(Number(limit) || 10);

      const totalRecords = await Clicks.countDocuments({ link: { $in: userLinksIds } });

    return res.status(200).json({
      success: true,
      clciks: userClicks, 
      count: totalRecords,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

// get specific link data
router.get("/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const linkData = await Link.findOne({ user: userId, _id: id });
    if (!linkData) {
      return res
        .status(404)
        .json({ success: false, message: "No Data found!" });
    }

    res.status(200).json({
      originalLink: linkData.originalLink,
      remark: linkData.remark,
      date: linkData.expireDate,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

// update link
router.patch("/:id", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const { originalLink, remark, expireDate } = req.body;
  try {

    const exist = await Link.findById(id);
    if (!exist) {
      return res
        .status(400)
        .json({ success: false, message: "link not found" });
    }

    await Link.findByIdAndUpdate(id, {
      originalLink,
      remark,
      expireDate,
    });

    if(expireDate){
      await Link.findByIdAndUpdate(id, {
        activeStatus: "Active"
      })
    }

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

// delete link
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const exist = await Link.findById(id);
    if (!exist) {
      return res
        .status(400)
        .json({ success: false, message: "link not found" });
    }

    // Delete the link
    await Link.findByIdAndDelete(id);

    // Delete associated clicks
    await Clicks.deleteMany({ link: id });

    return res.status(200).json({
      success: true,
      message: "Link Deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Interval Server Error !" });
  }
});

module.exports = router;
