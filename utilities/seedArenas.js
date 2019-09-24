const mongoose = require("mongoose");
const db = mongoose.connection;
require("dotenv").config({ path: "../.env" });
const { Arena } = require("../Models/Arena");
const arenaData = require("../StaticData/arenaData");
const getDbUri = require("../getDbUri");

// Connect to the Mongo DB
const MONGODB_URI = getDbUri(
  process.env.MONGODB_URI || process.env.NODE_ENV || "development"
);
console.log(`trying to get db, MONGODB_URI = ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log(`Connected successfully to local mongo db.`);
  arenaData.forEach(item => {
    let arena = new Arena({ ...item });
    arena.save((err, result) => {
      if (err) console.log(err);
      console.log(
        `${result.name} saved to the database with id = ${result._id}`
      );
    });
  });
});
