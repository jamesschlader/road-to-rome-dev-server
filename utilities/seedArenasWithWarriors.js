const fill = require("./fillArenaWithWarriors");
const axios = require("axios");

axios({
  url: `http://localhost:3001/graphql`,
  method: "POST",
  data: {
    query: `{
      arenas{
        id
      }
    }
    
    `
  }
}).then(arenas => {
  console.log(arenas.data.data);
  arenas.data.data.arenas.map(async arena => {
    setTimeout(async () => {
      const result = await fill(1, arena.id);
      console.log(`result in seed... is `, result);
      result.then(response => {
        response.map(warrior => {
          const name = warrior.name;
          const image = warrior.image;
          const male = warrior.male;
          const strength = warrior.strength;
          const speed = warrior.speed;
          const stamina = warrior.stamina;
          const skill = warrior.skill;
          const alive = warrior.alive;
          const ArenaId = warrior.ArenaId;

          axios({
            url: `http://localhost:3001/graphql`,
            method: "POST",
            data: {
              query: `mutation{
            addWarrior(name: "${name}",
            image: "${image}",
            male: ${Boolean(male)},
            strength: ${strength},
            speed: ${speed},
            stamina: ${stamina},
            skill: ${skill},
            ArenaId: ${ArenaId},
            alive: ${Boolean(alive)}){
                id
                name
            }
        }`
            }
          })
            .then(newWarrior => console.log(newWarrior.data))
            .catch(error => console.log(`error: `, error.response.data))
            .finally(() => {
              console.log(`All done!`);
            });
        });
      });
    });
  }, 300);
});
