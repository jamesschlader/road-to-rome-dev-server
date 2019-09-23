const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WarriorSchema = new Schema({
  name: { type: String, required: true },
  image: String,
  male: { type: Boolean, default: true },
  wallet: Number,
  strength: { type: Number, default: 11 },
  speed: { type: Number, default: 3 },
  stamina: { type: Number, default: 12 },
  skill: { type: Number, default: 1 },
  ArenaId: Schema.Types.ObjectId,
  weaponsIdList: [Schema.Types.ObjectId],
  armorIdList: [Schema.Types.ObjectId],
  battlesIdList: [Schema.Types.ObjectId],
  winnings: Number,
  alive: { type: Boolean, default: true },
  show: { type: Boolean, default: true },
  username: { type: String, required: true, default: "CPU" }
});

const Warrior = mongoose.model("Warrior", WarriorSchema);

module.exports = { Warrior, WarriorSchema };
