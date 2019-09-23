const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArmorSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  strength: { type: Number, min: 1, required: true },
  cost: { type: Number, default: 0 },
  costType: { type: String, default: "gp" },
  weight: { type: Number, default: 1 },
  image: String,
  shield: { type: Boolean, default: false }
});

ArmorSchema.virtual("size").get(function() {
  return this.weight > 45 ? "heavy" : this.weight < 14 ? "light" : "medium";
});

const Armor = mongoose.model("Armor", ArmorSchema);

module.exports = { Armor, ArmorSchema };
