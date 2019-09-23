const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MarketSchema = new Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 100 },
  weaponIds: [Schema.Types.ObjectId],
  armorIds: [Schema.Types.ObjectId],
  skillsUpgradeCost: Number,
  gearCostFactor: {
    type: Schema.Types.Number,
    min: 0.1,
    max: 2.0,
    default: 1.0
  }
});

const Market = mongoose.model("Market", MarketSchema);

module.exports = { MarketSchema, Market };
