const axios = require("axios");
const d6 = require("./d6.js");
const { getImage } = require("../utilities/pickImage");

const origin = require("./origin");

async function createWarrior(ArenaId) {
  const gender = Math.random() < 0.75 ? true : false;
  const usage = origin();
  const url = `http://behindthename.com/api/random.json?number=1&usage=${usage}&gender=${
    gender ? "m" : "f"
  }&key=ja756845453`;
  let name;
  try {
    name = await axios.get(url);
    const time = new Date();
    if (!name.data.error) {
      console.log(`name coming back from behindthename: `, name.data);
    }
    console.log(
      `arena ${ArenaId}: new warrior created at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`
    );
  } catch (error) {
    console.log(error);
  }

  const strength = gender ? 2 + d6(3) : 1 + d6(3);
  const stamina = 2 + d6(3);
  const speed = strength > 14 ? d6() : d6() + 2;
  const skill = d6();
  const image = getImage(gender);
  try {
    return {
      name: name.data.names[0],
      strength,
      stamina,
      speed,
      skill,
      image,
      gender,
      alive: true,
      ArenaId
    };
  } catch (err) {
    console.log(
      `no name returned from the api.Gonna return ${
        gender ? "Peter" : "Alice"
      } instead.`
    );
    return {
      name: gender ? "Peter" : "Alice",
      strength,
      stamina,
      speed,
      skill,
      image,
      gender,
      alive: true,
      ArenaId
    };
  }
}

module.exports = createWarrior;
