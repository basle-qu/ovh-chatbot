"use strict";

const Bluebird = require("bluebird");
const mongoose = require("mongoose");

mongoose.Promise = Bluebird;

/**
 * MobileAuth Schema
 */
const MobileAuthSchema = new mongoose.Schema({
  deviceid: {
    type: String,
    required: true
  },
  _nichandle: {
    type: String,
    ref: "Mobile"
  },
  cookie: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    expires: "15s",
    "default": Date.now()
  }
});

/**
 * Methods
 */
MobileAuthSchema.method({});

/**
 * Statics
 */
MobileAuthSchema.statics = {
  get (deviceid, senderId) {
    return this.findOne({ deviceid, senderId }).exec().then((user) => {
      if (user) {
        return user;
      }
      const err = { message: "Mobile User not found", statusCode: 404 };
      return Bluebird.reject(err);
    });
  }
};

module.exports = mongoose.model("MobileAuth", MobileAuthSchema);
