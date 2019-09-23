const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArenaSchema = new Schema({
  name: { type: String, required: true },
  image: String,
  gamesFrequency: { type: Number, default: 1 },
  battleQuantity: { type: Number, default: 1 },
  warriorIds: [Schema.Types.ObjectId],
  battleIds: [Schema.Types.ObjectId],
  MarketId: Schema.Types.ObjectId
});

const Arena = mongoose.model("Arena", ArenaSchema);

module.exports = { Arena, ArenaSchema };
