module.exports = function WOKData(dataName) {
  const _ = require("lodash");
  if (!dataName || !_.isString(dataName)) return null;
  else if (!dataName.startsWith("wokcommands-"))
    dataName = `wokcommands-${dataName}`;
  const { mongo } = require("../index").client;
  return mongo.models[dataName];
};
