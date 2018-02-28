"use strict";

const Bluebird = require("bluebird");
const { ButtonsListMessage, Button, TextMessage, ButtonsMessage } = require("../generics");
const MobileMessage = require("../../models/mobile.model");
const config = require("../../config/config-loader").load();
const { textMessageAdapter, buttonAdapter, buttonListAdapter } = require("./mobile_adapters");

function parseMsg (uResponse) {

  if (typeof uResponse === "string") {
    return textMessageAdapter(uResponse);
  }

  if (uResponse instanceof TextMessage) {
    return textMessageAdapter(uResponse.text);
  }

  if (uResponse instanceof Button) {
    return buttonAdapter(uResponse);
  }

  if (uResponse instanceof ButtonsListMessage || uResponse instanceof ButtonsMessage) {
    return buttonListAdapter(uResponse);
  }

  return uResponse;
}

function send (res, id, deviceid, rawResponsesPar) {
  let flagUseRes = true;
  let nichandle = id;
  let rawResponses = rawResponsesPar;
  let response;
  let histResponse;

  // input validation
  if (!rawResponses) {
    rawResponses = id;
    nichandle = null;
  }

  // detect if res is the nichandle or the response from express.
  if (typeof res === "string") {
    nichandle = res;
    flagUseRes = false;
  }

  // check if the response was used
  if (!res || (res && res.headersSent)) {
    flagUseRes = false;
  }

  // validate the nichandle
  if (typeof nichandle !== "string") {
    nichandle = null;
  }

  // parse the rawResponses into a suitable format
  response = parseMsg(rawResponses);

  // push the message to db for conversation history
  histResponse = response;
  histResponse.origin = "bot";
  return pushToHistory(id, deviceid, histResponse)
    .then(() => {
      // if we cant answer, we save to db for later
      if (flagUseRes) {
        return Bluebird.resolve(response);
      }
      return Bluebird.resolve();
    });
}

function getHistory (res, nichandle, deviceid) {
  if (!deviceid) {
    return Bluebird.reject(new Error("Invalid deviceid"));
  }

  return MobileMessage.findOne({ deviceid, nichandle }).lean().exec().then((result) => result && Array.isArray(result.history) && result.history.length ? result.history : []);
}

function pushToHistory (nichandle, deviceid, msg) {

  return MobileMessage.findOneAndUpdate(
    { deviceid, nichandle },
    {
      $push: {
        history: {
          $each: [msg],
          $slice: -config.mobile.historyLength // last X element
        }
      }
    },
    { upsert: true }
  ).exec();
}

module.exports = {
  send,
  getHistory,
  pushToHistory
};
