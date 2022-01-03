const path = require("path");
const pathName = __filename.replace(".js", "");
const fileName = path.basename(pathName);

const dataModel = require("../../../functions/WOKData")(fileName);

async function set(_id, data) {
  await dataModel.findOneAndUpdate(
    { _id },
    { _id, prefix: data },
    { upsert: true }
  );
}

// get function
async function get(_id) {
  return (await dataModel.findOne({ _id })) || {};
}

module.exports = { set: set, get: get };
