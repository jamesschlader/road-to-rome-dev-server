require("dotenv").config({ path: "../.env" });
require("./originTests/origin.tests");
require("./connectionTests/connection.tests");

const d6 = require("../utilities/d6");
const createWarrior = require("../utilities/createWarrior");
const maleImages = require("../StaticData/maleImages");
const femaleImages = require("../StaticData/femaleImages");
const { pickImage } = require("../utilities/pickImage");

describe("d6.js", () => {
  it("should return an integer equal to or greater than n but not greater than n * 6", () => {
    for (let i = 0; i < 10000; i++) {
      const result = d6(3);
      expect(result).toBeGreaterThanOrEqual(3);
      expect(result).toBeLessThanOrEqual(18);
    }
  });
});

describe("d6.js", () => {
  it("should return a number between 1 and 6 if no parameter was passed in", () => {
    const result = d6();
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });
});

describe("createWarrior.js", () => {
  it("should return a warrior object with defined values for: name, strength, stamina, speed, skill, image, and alive", () => {
    const warrior = createWarrior();
    warrior.then(item => {
      const warrior = item;
      expect(warrior.name).toBeDefined();
      expect(warrior.strength).toBeDefined();
      expect(warrior.stamina).toBeDefined();
      expect(warrior.speed).toBeDefined();
      expect(warrior.skill).toBeDefined();
      expect(warrior.image).toBeDefined();
      expect(warrior.alive).toBeDefined();
    });
  });
});

describe("createWarrior.js", () => {
  it("should be true for male or false for female for warrior.gender", () => {
    const warrior = createWarrior();
    warrior.then(item => {
      const warrior = item;
      warrior.gender
        ? expect(warrior.gender).toBeTruthy()
        : expect(warrior.gender).toBeFalsy();
    });
  });
});

describe("pickImage.js", () => {
  it("should produce a number between 0 and one less than maleImages.length when gender === true", () => {
    const imageIndex = pickImage(true);
    expect(imageIndex).toBeGreaterThanOrEqual(0);
    expect(imageIndex).toBeLessThan(maleImages.length);
  });
});

describe("pickImage.js", () => {
  it("should produce a number between 0 and one less than femaleImages.length when gender === false", () => {
    const imageIndex = pickImage(false);
    expect(imageIndex).toBeGreaterThanOrEqual(0);
    expect(imageIndex).toBeLessThan(femaleImages.length);
  });
});
