require("dotenv").config();
const axios = require("axios");
const { Armor } = require("../Models/Armor");
const { Weapon } = require("../Models/Weapon");
const dnd = "http://www.dnd5eapi.co/api/equipment/";
const mongoose = require("mongoose");
const db = mongoose.connection;
const getDbUri = require("../getDbUri");

console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);

// Connect to the Mongo DB
const MONGODB_URI = getDbUri(process.env.NODE_ENV || "development");

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log(`Connected successfully to local mongo db.`);

  for (var i = 1; i < 51; i++) {
    axios.get(`${dnd}${i}`).then(body => {
      const target = body.data;

      if (target.equipment_category === "Weapon") {
        if (target.weapon_range === "Melee") {
          if (target.name !== "Lance") {
            const item = {
              name: target.name,
              damage: target.damage.dice_count * target.damage.dice_value,
              cost: target.cost.quantity,
              costType: target.cost.unit,
              weight: target.weight
            };

            let weapon = new Weapon({ ...item });

            weapon.save(function(err, result) {
              if (err) console.log(err);
              console.log(
                `${result.name} saved to the database with id = ${result._id}`
              );
            });
          }
        }
      } else if (target.equipment_category === "Armor") {
        const item = {
          name: target.name,
          strength: target.armor_class.base,
          cost: target.cost.quantity,
          costType: target.cost.unit,
          weight: target.weight,
          shield: target.name === "Shield" ? true : false
        };

        let armor = new Armor({ ...item });

        armor.save(function(err, result) {
          if (err) console.log(err);
          console.log(
            `${result.name} saved to database with id = ${result._id}`
          );
        });
      }
    });
  }
});
