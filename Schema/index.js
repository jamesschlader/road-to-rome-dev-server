const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLFloat
} = graphql;

const { Arena } = require("../Models/Arena");
const { Warrior } = require("../Models/Warrior");
const { Weapon } = require("../Models/Weapon");
const { Armor } = require("../Models/Armor");
const { Market } = require("../Models/Market");
const { Battle } = require("../Models/Battle");
const { User } = require("../Models/User");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    first: { type: GraphQLString },
    last: { type: GraphQLString },
    image: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    motto: { type: GraphQLString },
    stableIds: {
      type: new GraphQLList(GraphQLID)
    },
    stable: {
      type: new GraphQLList(WarriorType),
      resolve(parent, args) {
        if (parent.stableIds) {
          console.log(`parent.stableIds = `, parent.stableIds);
          const warriors = parent.stableIds.map(id => Warrior.findById(id));
          return warriors;
        } else return [];
      }
    },
    activeStable: {
      type: new GraphQLList(WarriorType),
      async resolve(parent, args) {
        if (parent.stableIds) {
          const warriors = parent.stableIds.map(
            async id =>
              await Warrior.findById(id).then(warrior => {
                return warrior.alive ? warrior : null;
              })
          );
          return warriors;
        } else return [];
      }
    }
  })
});

const ArenaType = new GraphQLObjectType({
  name: "Arena",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    gamesFrequency: { type: GraphQLInt },
    battleQuantity: { type: GraphQLInt },
    warriorIds: { type: new GraphQLList(GraphQLID) },
    warriorList: {
      type: new GraphQLList(WarriorType),
      resolve(parent, args) {
        return parent.warriorIds.map(id => Warrior.findById({ _id: id }));
      }
    },
    livingWarriors: {
      type: new GraphQLList(WarriorType),
      resolve(parent, args) {
        return Warrior.find({ alive: true, show: true, ArenaId: parent.id });
      }
    },
    userWarrior: {
      type: new GraphQLList(WarriorType),
      resolve(parent, args) {
        return parent.warriorIds.filter(id => {
          if (id === args.warriorId)
            return Warrior.findById(id).then(result => {
              return result;
            });
        });
      }
    },
    battleIds: { type: new GraphQLList(GraphQLID) },
    scheduledBattles: {
      type: new GraphQLList(BattleType),
      resolve(parent, args) {
        return Battle.find({
          ArenaId: parent._id,
          scheduled: true
        }).then(result => {
          return result;
        });
      }
    },
    battleArchive: {
      type: new GraphQLList(BattleType),
      resolve(parent, args) {
        return parent.battleIds.map(id =>
          Battle.findById(id).then(battle => {
            return battle;
          })
        );
      }
    },
    MarketId: {
      type: GraphQLID
    },
    Market: {
      type: MarketType,
      resolve(parent, args) {
        return Market.findById({ _id: parent.MarketId });
      }
    }
  })
});

const WarriorType = new GraphQLObjectType({
  name: "Warrior",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    male: { type: GraphQLBoolean },
    wallet: { type: GraphQLInt },
    strength: { type: GraphQLInt },
    speed: { type: GraphQLInt },
    stamina: { type: GraphQLInt },
    skill: { type: GraphQLInt },
    ArenaId: { type: GraphQLID },
    Arena: {
      type: ArenaType,
      resolve(parent, args) {
        return !parent.ArenaId
          ? Arena.find({ name: "Carthago" }).then(result => {
              parent.ArenaId = result[0]._id;
              parent.save();
              return result[0];
            })
          : Arena.findById(parent.ArenaId);
      }
    },

    armorIdList: {
      type: new GraphQLList(GraphQLID)
    },
    armorList: {
      type: new GraphQLList(ArmorType),
      resolve(parent, args) {
        return parent.armorIdList.length > 0
          ? parent.armorIdList.map(id => Armor.findById(id))
          : Armor.find({ name: "None" }).then(result => {
              parent.armorList = result;
              parent.save();
              return result;
            });
      }
    },

    weaponsIdList: { type: new GraphQLList(GraphQLID) },

    weaponList: {
      type: new GraphQLList(WeaponType),
      resolve(parent, args) {
        return parent.weaponsIdList.length > 0
          ? parent.weaponsIdList.map(id => Weapon.findById(id))
          : Weapon.find({ name: "Fists" }).then(result => {
              parent.weaponList = result;
              parent.save();
              return result;
            });
      }
    },

    battlesIdList: { type: new GraphQLList(GraphQLID) },

    battlesList: {
      type: new GraphQLList(BattleType),
      resolve(parent, args) {
        return parent.battlesIdList.map(id => {
          return Battle.findById(id).then(battle => {
            return battle;
          });
        });
      }
    },
    nextScheduledBattle: {
      type: new GraphQLList(BattleType),
      resolve(parent, args) {
        return parent.battlesIdList.map(id => {
          return Battle.findById(id).then(battle => {
            if (battle !== null) {
              return battle;
            } else {
              return new Battle({ ArenaId: parent.ArenaId });
            }
          });
        });
      }
    },
    winnings: { type: GraphQLInt },
    alive: { type: GraphQLBoolean },
    show: { type: GraphQLBoolean },
    username: { type: GraphQLString }
  })
});

const MarketType = new GraphQLObjectType({
  name: "Market",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    weaponIds: { type: new GraphQLList(GraphQLID) },
    weaponList: {
      type: new GraphQLList(WeaponType),
      resolve(parent, args) {
        return parent.weaponIds.map(id => Weapon.findById({ _id: id }));
      }
    },
    armorIds: { type: new GraphQLList(GraphQLID) },
    armorList: {
      type: new GraphQLList(ArmorType),
      resolve(parent, args) {
        return parent.armorIds.map(id => Armor.findById({ _id: id }));
      }
    },
    skillsUpgradeCost: { type: GraphQLInt },
    gearCostFactor: { type: GraphQLFloat }
  })
});

const BattleType = new GraphQLObjectType({
  name: "Battle",
  fields: () => ({
    id: { type: GraphQLID },
    ArenaId: { type: GraphQLID },
    Arena: {
      type: ArenaType,
      resolve(parent, args) {
        return Arena.findById({ _id: parent.ArenaId });
      }
    },
    playerOneId: { type: GraphQLID },
    playerTwoId: { type: GraphQLID },

    playerOne: {
      type: WarriorType,
      resolve(parent, args) {
        return parent.playerOneId ? Warrior.findById(parent.playerOneId) : [];
      }
    },
    playerTwo: {
      type: WarriorType,
      resolve(parent, args) {
        return parent.playerTwoId ? Warrior.findById(parent.playerTwoId) : [];
      }
    },
    winnerId: { type: GraphQLID },
    winner: {
      type: WarriorType,
      resolve(parent, args) {
        return Warrior.findById(parent.winnerId).then(warrior => {
          return warrior;
        });
      }
    },
    purse: { type: GraphQLInt },
    scheduled: { type: GraphQLBoolean },
    date: { type: GraphQLString }
  })
});

const ArmorType = new GraphQLObjectType({
  name: "Armor",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    strength: { type: GraphQLInt },
    cost: { type: GraphQLInt },
    costType: { type: GraphQLString },
    weight: { type: GraphQLInt },
    image: { type: GraphQLString },
    shield: { type: GraphQLBoolean },
    size: {
      type: GraphQLString
    }
  })
});

const WeaponType = new GraphQLObjectType({
  name: "Weapon",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    damage: { type: GraphQLInt },
    cost: { type: GraphQLInt },
    costType: { type: GraphQLString },
    weight: { type: GraphQLInt },
    image: { type: GraphQLString },
    size: {
      type: GraphQLString
    }
  })
});

////////////////////////////////////////////////////////
////// CRUD Operations Start Here           ////////////
////////////////////////////////////////////////////////

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ///////////////////////////
    // User Read Methods... //
    ///////////////////////////

    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, context) {
        console.log(`getting users, context = `, context.body);
        return User.find({});
      }
    },

    user: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args, context) {
        const { username, password } = args;
        const user = await User.findOne({ username });
        return (await user.comparePassword(password)) ? user : null;
      }
    },

    ///////////////////////////
    // Arena Read Methods... //
    ///////////////////////////

    // GET single Arena:
    arena: {
      type: ArenaType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Arena.findById(args.id);
      }
    },

    // Get ALL Arenas:
    arenas: {
      type: new GraphQLList(ArenaType),
      resolve(parent, args) {
        return Arena.find({});
      }
    },
    ///////////////////////////////
    // End Arena Read methods... //
    ///////////////////////////////

    ///////////////////////////
    // Market Read Methods... //
    ///////////////////////////

    // GET single Market:
    market: {
      type: MarketType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Arena.findById(args.id);
      }
    },

    // Get ALL Markets:
    markets: {
      type: new GraphQLList(MarketType),
      resolve(parent, args) {
        return Market.find({});
      }
    },
    ///////////////////////////////
    // End Market Read methods... //
    ///////////////////////////////

    ///////////////////////////
    // Warrior Read Methods... //
    ///////////////////////////

    // GET single Warrior:
    warrior: {
      type: WarriorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Warrior.findById(args.id);
      }
    },

    // Get ALL Warriors:
    warriors: {
      type: new GraphQLList(WarriorType),
      resolve(parent, args) {
        return Warrior.find({});
      }
    },
    ///////////////////////////////
    // End Warrior Read methods... //
    ///////////////////////////////

    ///////////////////////////
    // Battle Read Methods... //
    ///////////////////////////

    // GET single Battle:
    battle: {
      type: BattleType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Battle.findById(args.id);
      }
    },

    // Get ALL Battles:
    battles: {
      type: new GraphQLList(BattleType),
      resolve(parent, args) {
        return Battle.find({});
      }
    },
    ///////////////////////////////
    // End Battle Read methods... //
    ///////////////////////////////

    ///////////////////////////
    // Armor Read Methods... //
    ///////////////////////////

    // GET single Armor:
    armor: {
      type: ArmorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Armor.findById(args.id);
      }
    },

    // Get ALL Armors:
    armors: {
      type: new GraphQLList(ArmorType),
      resolve(parent, args) {
        return Armor.find({});
      }
    },
    ///////////////////////////////
    // End Armor Read methods... //
    ///////////////////////////////

    ///////////////////////////
    // Weapon Read Methods... //
    ///////////////////////////

    // GET single Weapon:
    weapon: {
      type: WeaponType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Weapon.findById(args.id);
      }
    },

    // Get ALL Weapons:
    weapons: {
      type: new GraphQLList(WeaponType),
      resolve(parent, args) {
        return Weapon.find({});
      }
    }
    ///////////////////////////////
    // End Weapon Read methods... //
    ///////////////////////////////
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ///////////////////////////
    // User Auth... //
    ///////////////////////////

    login: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args, context) {
        const { username, password } = args;
        const user = await User.findOne({ username });
        return (await user.comparePassword(password)) ? user : null;
      }
    },

    register: {
      type: UserType,
      args: {
        first: { type: GraphQLString },
        last: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        motto: { type: GraphQLString }
      },
      async resolve(parent, args) {
        console.log(`in register, here's the incoming args: `, args);
        const obj = { ...args, stableIds: [] };
        let user = new User({ ...obj });
        return await user.save();
      }
    },

    //////////////////////////////
    // Arena CUD Methods ////////
    /////////////////////////////

    addArena: {
      type: ArenaType,
      args: {
        name: { type: GraphQLString },
        image: { type: GraphQLString },
        gamesFrequency: { type: GraphQLInt },
        battleQuantity: { type: GraphQLInt },
        warriorIds: { type: new GraphQLList(GraphQLID) },
        battleIds: { type: new GraphQLList(GraphQLID) },
        MarketId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let arena = new Arena({
          ...args
        });
        return arena.save();
      }
    },

    updateArena: {
      type: ArenaType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        image: { type: GraphQLString },
        gamesFrequency: { type: GraphQLInt },
        battleQuantity: { type: GraphQLInt },
        warriorIds: { type: new GraphQLList(GraphQLID) },
        battleIds: { type: new GraphQLList(GraphQLID) },
        MarketId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Arena.findOneAndUpdate(
          { _id: args.id },
          {
            ...args
          }
        );
      }
    },

    deleteArena: {
      type: ArenaType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Arena.findByIdAndRemove({ _id: args.id });
      }
    },

    //////////////////////////////
    // Market CUD Methods ////////
    /////////////////////////////

    addMarket: {
      type: MarketType,
      args: {
        name: { type: GraphQLString },
        weaponIds: { type: new GraphQLList(GraphQLID) },
        armorIds: { type: new GraphQLList(GraphQLID) },
        skillsUpgradeCost: { type: GraphQLInt },
        gearCostfactor: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        let market = new Market({
          ...args
        });
        return market.save();
      }
    },

    updateMarket: {
      type: MarketType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        weaponIds: { type: new GraphQLList(GraphQLID) },
        armorIds: { type: new GraphQLList(GraphQLID) },
        skillsUpgradeCost: { type: GraphQLInt },
        gearCostfactor: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        return Market.findOneAndUpdate(
          args.id,
          {
            ...args
          },
          { upsert: true }
        );
      }
    },

    deleteMarket: {
      type: MarketType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Market.findByIdAndRemove({ _id: args.id });
      }
    },

    //////////////////////////////
    // Battle CUD Methods ////////
    /////////////////////////////

    addBattle: {
      type: BattleType,
      args: {
        ArenaId: { type: GraphQLID },
        purse: { type: GraphQLInt },
        playerOneId: { type: GraphQLID },
        playerTwoId: { type: GraphQLID },
        scheduled: { type: GraphQLBoolean },
        date: { type: GraphQLString }
      },
      resolve(parent, args) {
        let battle = new Battle({
          ...args
        });

        return battle.save().then(battle => {
          Arena.findById(args.ArenaId, (err, arena) => {
            if (err) console.log(err);
            if (arena.battleIds) {
              arena.battleIds = [...arena.battleIds, battle._id];
              arena.save().then(result => {
                console.log("saved arena with battle id");
              });
            } else {
              arena.battleIds = [battle._id];
              arena.save().then(result => {
                console.log("saved arena with battle id");
              });
            }
          });
          Warrior.findById(args.playerOneId, (err, warrior) => {
            if (err) console.log(err);
            if (warrior.battlesIdList) {
              warrior.battlesIdList = [...warrior.battlesIdList, battle._id];
              warrior.save().then(result => {
                console.log(
                  "Saved warrior with battle id",
                  result.battlesIdList
                );
              });
            } else {
              warrior.battlesIdList = [battle._id];
              warrior.save().then(result => {
                console.log(
                  "Saved warrior with battle id",
                  result.battlesIdList
                );
              });
            }
          });
          Warrior.findById(args.playerTwoId, (err, warrior) => {
            if (err) console.log(err);
            if (warrior.battlesIdList) {
              warrior.battlesIdList = [...warrior.battlesIdList, battle._id];
              warrior.save().then(result => {
                console.log(
                  "Saved warrior with battle id",
                  result.battlesIdList
                );
              });
            } else {
              warrior.battlesIdList = [battle._id];
              warrior.save().then(result => {
                console.log(
                  "Saved warrior with battle id",
                  result.battlesIdList
                );
              });
            }
          });
        });
      }
    },

    updateBattle: {
      type: BattleType,
      args: {
        id: { type: GraphQLID },
        winnerId: { type: GraphQLID },
        scheduled: { type: GraphQLBoolean }
      },
      resolve(parent, args) {
        return Battle.findByIdAndUpdate(args.id, { ...args });
      }
    },

    deleteBattle: {
      type: BattleType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        Battle.findById(args.id).then(battle => {
          Arena.findById(battle.ArenaId).then(arena => {
            const refresh = arena.battleIds.filter(id => {
              return id !== args.id;
            });
            arena.battleIds = refresh;
            arena.save();
          });
          Warrior.findById(battle.playerOneId).then(warrior => {
            const refresh = warrior.battlesIdList.filter(id => {
              return id !== args.id;
            });
            warrior.battlesIdList = refresh;
            warrior.save();
          });
          Warrior.findById(battle.playerTwoId).then(warrior => {
            const refresh = warrior.battlesIdList.filter(id => {
              return id !== args.id;
            });
            warrior.battlesIdList = refresh;
            warrior.save();
          });
        });
        return Battle.findByIdAndRemove(args.id).then(result => {
          return result;
        });
      }
    },

    deleteManyBattles: {
      type: BattleType,
      args: {
        ids: { type: new GraphQLList(GraphQLID) }
      },
      resolve(parent, args) {
        args.ids.map(argsId => {
          Battle.findById(argsId).then(battle => {
            Arena.findById(battle.ArenaId).then(arena => {
              const refresh = arena.battleIds.filter(id => {
                return id !== argsId;
              });
              arena.battleIds = refresh;
              arena.save();
            });
            Warrior.findById(battle.playerOneId).then(warrior => {
              const refresh = warrior.battlesIdList.filter(id => {
                return id !== argsId;
              });
              warrior.battlesIdList = refresh;
              warrior.save();
            });
            Warrior.findById(battle.playerTwoId).then(warrior => {
              const refresh = warrior.battlesIdList.filter(id => {
                return id !== argsId;
              });
              warrior.battlesIdList = refresh;
              warrior.save();
            });
          });
          return Battle.findByIdAndRemove(argsId).then(result => {
            return result;
          });
        });
      }
    },

    //////////////////////////////
    // Warrior CUD Methods ////////
    /////////////////////////////

    addWarrior: {
      type: WarriorType,
      args: {
        name: { type: GraphQLString },
        image: { type: GraphQLString },
        male: { type: GraphQLBoolean },
        wallet: { type: GraphQLInt },
        strength: { type: GraphQLInt },
        speed: { type: GraphQLInt },
        stamina: { type: GraphQLInt },
        skill: { type: GraphQLInt },
        ArenaId: { type: GraphQLID },
        weaponsIdList: { type: new GraphQLList(GraphQLID) },

        armorIdList: { type: new GraphQLList(GraphQLID) },

        battlesIdList: { type: new GraphQLList(GraphQLID) },
        winnings: { type: GraphQLInt },
        alive: { type: GraphQLBoolean },
        show: { type: GraphQLBoolean },
        username: { type: GraphQLString }
      },
      resolve(parent, args) {
        console.log(`warrior args: `, args);
        let warrior = new Warrior({ ...args });
        const obj = warrior.save();

        return obj.then(warrior => {
          console.log(`warrior object = `, warrior);
          Arena.findById(warrior.ArenaId).then(arena => {
            arena.warriorIds.push(warrior._id);
            arena.save();
          });
          User.findOne({ username: args.username }).then(user => {
            console.log(`user = `, user);
            user.stableIds.push(warrior._id);
            user.save();
          });
        });
      }
    },

    updateWarrior: {
      type: WarriorType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        image: { type: GraphQLString },
        male: { type: GraphQLBoolean },
        wallet: { type: GraphQLInt },
        strength: { type: GraphQLInt },
        speed: { type: GraphQLInt },
        stamina: { type: GraphQLInt },
        skill: { type: GraphQLInt },
        ArenaId: { type: GraphQLID },
        weaponsIdList: { type: new GraphQLList(GraphQLID) },

        armorIdList: { type: new GraphQLList(GraphQLID) },

        battlesIdList: { type: new GraphQLList(GraphQLID) },
        winnings: { type: GraphQLInt },
        alive: { type: GraphQLBoolean },
        show: { type: GraphQLBoolean }
      },
      resolve(parent, args) {
        return Warrior.findByIdAndUpdate(args.id, { ...args });
      }
    },

    deleteWarrior: {
      type: WarriorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        let returnObj = {};
        Warrior.findById(args.id, (error, warrior) => {
          if (error) console.log(error);

          if (warrior.battlesIdList.length > 0) {
            warrior.show = false;
            warrior.save();
            Arena.findById(warrior.ArenaId, (error, arena) => {
              if (error) console.log(error);

              const list = arena.warriorIds.filter(item => {
                return item != warrior.id;
              });

              arena.warriorIds = list;
              arena.save();
              returnObj = warrior;
            });
            User.findOne({ username: warrior.username }, (error, user) => {
              const newStable = user.stableIds.filter(id => {
                return id !== warrior._id;
              });
              user.stableIds = newStable;
              user.save();
            });
          } else {
            returnObj = Warrior.findByIdAndDelete(args.id);
          }
        }).then(result => {
          return returnObj;
        });
      }
    },

    //////////////////////////////
    // Armor CUD Methods ////////
    /////////////////////////////

    addArmor: {
      type: ArmorType,
      args: {
        name: { type: GraphQLString },
        strength: { type: GraphQLInt },
        cost: { type: GraphQLInt },
        costType: { type: GraphQLString },
        weight: { type: GraphQLInt },
        image: { type: GraphQLString },
        shield: { type: GraphQLBoolean }
      },
      resolve(parent, args) {
        let armor = new Armor({
          ...args
        });
        return armor.save();
      }
    },

    updateArmor: {
      type: ArmorType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        strength: { type: GraphQLInt },
        cost: { type: GraphQLInt },
        costType: { type: GraphQLString },
        weight: { type: GraphQLInt },
        image: { type: GraphQLString },
        shield: { type: GraphQLBoolean }
      },
      resolve(parent, args) {
        return Armor.findOneAndUpdate(
          args.id,
          {
            ...args
          },
          { upsert: true }
        );
      }
    },

    deleteArmor: {
      type: ArmorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Armor.findByIdAndRemove({ _id: args.id });
      }
    },

    //////////////////////////////
    // Weapon CUD Methods ////////
    /////////////////////////////

    addWeapon: {
      type: WeaponType,
      args: {
        name: { type: GraphQLString },
        damage: { type: GraphQLInt },
        cost: { type: GraphQLInt },
        costType: { type: GraphQLString },
        weight: { type: GraphQLInt },
        image: { type: GraphQLString }
      },
      resolve(parent, args) {
        let weapon = new Weapon({
          ...args
        });
        return weapon.save();
      }
    },

    updateWeapon: {
      type: WeaponType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        damage: { type: GraphQLInt },
        cost: { type: GraphQLInt },
        costType: { type: GraphQLString },
        weight: { type: GraphQLInt },
        image: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Weapon.findOneAndUpdate(
          args.id,
          {
            ...args
          },
          { upsert: true }
        );
      }
    },

    deleteWeapon: {
      type: WeaponType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Weapon.findByIdAndRemove({ _id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
