const mongoose = require("mongoose"),
  { Mixed } = mongoose.Schema.Types;

// Create the schema for datas
const dataSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  data: { type: Mixed, required: true },
});

// Create the model
const dataModel = mongoose.model("data", dataSchema);

/**
 *
 * @param {String} _id
 */
// set function
async function set(_id, data) {
  await dataModel.findOneAndUpdate(
    { _id },
    { _id, data },
    { upsert: true, new: true }
  );
}

/**
 *
 * @param {String} _id
 */
// get function
async function get(_id) {
  const dataSchema = await dataModel.findOne({ _id });
  return dataSchema ? dataSchema.get("data") : {};
  // try { return (await data.data || {}); } catch {}
}

module.exports = { set: set, get: get };
