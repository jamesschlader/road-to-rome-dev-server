const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WeaponSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  damage: { type: Number, default: 1 },
  cost: { type: Number, default: 0 },
  costType: { type: String, default: "gp" },
  weight: { type: Number, default: 1 },
  image: String
});

WeaponSchema.virtual("size").get(function() {
  return this.weight > 6 ? "heavy" : this.weight < 3 ? "light" : "medium";
});

const Weapon = mongoose.model("Weapon", WeaponSchema);

module.exports = { Weapon, WeaponSchema };
