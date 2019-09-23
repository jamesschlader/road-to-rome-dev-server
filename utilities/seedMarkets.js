const mongoose = require("mongoose");
const db = mongoose.connection;
const { Market } = require("../Models/Market");
const { Arena } = require("../Models/Arena");
const marketData = require("../StaticData/marketData");
const getDbUri = require("../getDbUri");

// Connect to the Mongo DB
const MONGODB_URI = getDbUri(process.env.NODE_ENV || "development");

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log(`Connected successfully to local mongo db.`);
  marketData.forEach(market => {
    let newMarket = new Market({ ...market });
    newMarket.save((err, response) => {
      if (err) console.log(err);
      console.log(`${response.name} Market _id = ${response._id}`);
      Arena.updateOne(
        { name: response.name },
        { MarketId: response._id },
        (err, results) => {
          if (err) console.log(err);
        }
      );
    });
  });
});
