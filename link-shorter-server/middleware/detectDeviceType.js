const detectDeviceType = (req, res, next) => {
  const userAgent = req.headers["user-agent"];

  if (/mobile/i.test(userAgent)) {
    req.deviceType = "mobile";
  } else if (/tablet/i.test(userAgent)) {
    req.deviceType = "tablet";
  } else {
    req.deviceType = "desktop";
  }
  next();
};

module.exports = detectDeviceType;
