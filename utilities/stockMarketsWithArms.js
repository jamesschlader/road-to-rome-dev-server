const { Armor } = require("../Models/Armor");
const { Weapon } = require("../Models/Weapon");
const { Arena } = require("../Models/Arena");
const { Market } = require("../Models/Market");
const mongoose = require("mongoose");
const db = mongoose.connection;
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
  Weapon.find({}, (err, weapons) => {
    const mediumWeapons = weapons.filter(weapon => {
      return weapon.cost * 100 < 1000 ? weapon : null;
    });
    const bigWeapons = weapons.filter(weapon => {
      return weapon.cost * 100 < 1500 ? weapon : null;
    });
    const biggerWeapons = weapons.filter(weapon => {
      return weapon.cost * 100 < 3000 ? weapon : null;
    });

    Armor.find({}, (err, armors) => {
      const mediumArmors = armors.filter(armor => {
        return armor.cost < 75 ? armor : null;
      });
      const bigArmors = armors.filter(armor => {
        return armor.cost < 400 ? armor : null;
      });
      const largerArmors = armors.filter(armor => {
        return armor.cost < 751 ? armor : null;
      });

      Arena.find({}, (err, arenas) => {
        const armedMarkets = arenas.map(arena => {
          const value = arena.gamesFrequency * arena.battleQuantity;
          console.log(
            `Arena: ${arena.name} Value = ${value} MarketId: ${arena.MarketId}`
          );
          if (value < 24) {
            Market.updateOne(
              { _id: arena.MarketId },
              {
                armorIds: mediumArmors,
                weaponIds: mediumWeapons
              },
              (err, result) => {
                if (err) {
                  console.log(
                    `Failure to update ${arena.MarketId} with armors and weapons.`
                  );
                }

                console.log(
                  `Updated ${arena.name} with armor and weapons. Market._id = ${result._id}`
                );
              }
            );
          }
          if (value > 23 && value < 40) {
            Market.updateOne(
              { _id: arena.MarketId },
              {
                armorIds: bigArmors,
                weaponIds: bigWeapons
              },
              (err, result) => {
                if (err) {
                  console.log(
                    `Failure to update ${arena.MarketId} with armors and weapons.`
                  );
                }

                console.log(
                  `Updated ${arena.name} with armor and weapons. Market._id = ${result._id}`
                );
              }
            );
          }
          if (value > 39 && value < 60) {
            Market.updateOne(
              { _id: arena.MarketId },
              {
                armorIds: largerArmors,
                weaponIds: biggerWeapons
              },
              (err, result) => {
                if (err) {
                  console.log(
                    `Failure to update ${arena.MarketId} with armors and weapons.`
                  );
                }

                console.log(
                  `Updated ${arena.name} with armor and weapons. Market._id = ${result._id}`
                );
              }
            );
          }
          if (value > 59) {
            Market.updateOne(
              { _id: arena.MarketId },
              {
                armorIds: armors,
                weaponIds: weapons
              },
              (err, result) => {
                if (err) {
                  console.log(
                    `Failure to update ${arena.MarketId} with armors and weapons.`
                  );
                }

                console.log(
                  `Updated ${arena.name} with armor and weapons. Market._id = ${result._id}`
                );
              }
            );
          }
        });
      });
    });
  });
});
