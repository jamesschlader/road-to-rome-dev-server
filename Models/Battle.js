const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BattleSchema = new Schema({
  ArenaId: { type: Schema.Types.ObjectId, required: true },
  playerOneId: { type: Schema.Types.ObjectId, required: true },
  playerTwoId: { type: Schema.Types.ObjectId, required: true },
  winnerId: Schema.Types.ObjectId,
  purse: Number,
  scheduled: { type: Boolean, default: true },
  date: { type: String }
});

const Battle = mongoose.model("Battle", BattleSchema);

module.exports = { Battle, BattleSchema };
