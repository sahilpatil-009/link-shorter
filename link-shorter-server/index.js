const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const ConnectDB = require("./dbConnect/dbConnect.js");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const dashboardRoutes = require("./routes/dashboard.js");
const Link = require("./models/link.model.js");
const Clicks = require("./models/clicks.model.js")
const detectDeviceType = require("./middleware/detectDeviceType.js");

dotenv.config({});

const port = process.env.PORT || 3000;

ConnectDB();
app.use(cors());
app.use(express.json());
app.set('trust proxy', true);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).send("Something went wrong");
});

app.use("/user", userRoutes);
app.use("/dashboard", dashboardRoutes);

// Redirect route for short links
app.get("/:shortLink", detectDeviceType, async (req, res) => {
  const { shortLink } = req.params;

  try {
    const link = await Link.findOne({ shortLink });

    if (!link) {
      return res.status(404).render("error", {
        title: "404 Not Found",
        message: "The link you are trying to access does not exist.",
      });
    }

    const today = new Date();
    if (link.expireDate && link.expireDate < today) {
      return res.status(410).render("error", {
        title: "Link Expired",
        message: "This link has expired and is no longer active.",
      });
    }

    const clickData = {
      link: link._id,
      ipAddress: req.ip || "Unknown IP",
      userDevice: req.deviceType, 
      originalLink: link.originalLink,
      shortLink: link.shortLink,
    };

    const userClick = new Clicks(clickData);
    await userClick.save();

    link.totalClicks = (link.totalClicks || 0) + 1;

    const deviceType = req.deviceType;
    link.deviceClicks = link.deviceClicks || {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    };
    link.deviceClicks[deviceType] = (link.deviceClicks[deviceType] || 0) + 1;

    const currentDate = today.toISOString().split("T")[0];
    link.dateClicks = link.dateClicks || [];
    const dateEntry = link.dateClicks.find(
      (entry) => entry.date === currentDate
    );

    if (dateEntry) {
      dateEntry.count += 1;
    } else {
      link.dateClicks.push({ date: currentDate, count: 1 });
    }

    await link.save();
    return res.redirect(link.originalLink);
  } catch (error) {
    console.error("Error handling short link:", error);
    return res.status(500).render("error", {
      title: "Server Error",
      message: "Something went wrong. Please try again later.",
    });
  }
});

app.listen(port, () => {
  console.log(`listen on port ${port}`);
});
