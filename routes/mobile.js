"use strict";

let mobileCtrl = require("../controllers/mobile");

module.exports = function (app) {
  mobileCtrl = mobileCtrl();

  app.get("/mobile", mobileCtrl.onGet);
  app.post("/mobile", mobileCtrl.onPost);
};
