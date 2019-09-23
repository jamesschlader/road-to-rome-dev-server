const createWarrior = require("./createWarrior");

async function getFiveMore(n, arenaId) {
  let warriors = [];
  if (n <= 5) {
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        const warrior = createWarrior(arenaId);
        warrior.then(content => {
          warriors.push(content);
        });
      }, i * 250);
    }
    return warriors;
  } else {
    setTimeout(() => {
      getFiveMore(5, arenaId);
    }, 250);
    setTimeout(() => {
      getFiveMore(n - 5, arenaId);
    }, 6 * 250);
  }
}

const arenas = [1];
const warriorsToGet = 18;

const result = getFiveMore(warriorsToGet, arenas[0]);

// module.exports = fillArenaWithWarriors;
