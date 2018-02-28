"use strict";

const Bluebird = require("bluebird");
const mongoose = require("mongoose");

mongoose.Promise = Bluebird;

/**
 * Mobile Schema
 */
const ButtonSchema = new mongoose.Schema({
  type: String,
  value: String,
  text: String
});

const HistoryMessageSchema = new mongoose.Schema({
  message: {
    type: String
  },
  origin: {
    type: String
  },
  buttons: [ButtonSchema]
});

const MobileSchema = new mongoose.Schema({
  deviceid: {
    type: String,
    required: true
  },
  nichandle: {
    type: String,
    required: false,
    unique: true
  },
  history: [HistoryMessageSchema]
});

/**
 * Methods
 */
MobileSchema.method({});

/**
 * Statics
 */
MobileSchema.statics = {
  get (deviceid, nichandle) {
    return this.findOne({ deviceid, nichandle }).exec().then((user) => {
      if (user) {
        return user;
      }
      const err = { message: "Mobile User not found", statusCode: 404 };
      return Bluebird.reject(err);
    });
  }
};

module.exports = mongoose.model("Mobile", MobileSchema);
