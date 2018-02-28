"use strict";

module.exports = () =>
  function (req, res, next) {
    let user = {};
    let nic;

    if (!req.headers["x-ovh-deviceid"]) {
      return res.status(400).json("Device ID is missing");
    }
    if (!req.headers["x-ovh-langue"]) {
      return res.status(400).json("langue is missing");
    }

    user.deviceid = req.headers["x-ovh-deviceid"];
    user.language = req.headers["x-ovh-langue"];
    nic = req.cookies.NICHANDLE;

    if (nic) {
      user.nichandle = nic;
    }

    if (user) {
      req.user = user;
      return next();
    }
    return res.status(400).json("missing USER");
  };
