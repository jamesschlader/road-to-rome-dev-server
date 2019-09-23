const axios = require("axios");
const d6 = require("./d6");

axios({
  url: `http://localhost:3001/graphql`,
  method: "POST",
  data: {
    query: `{
            warriors{
              id
                name
                show
                armorIdList
                weaponsIdList
                Arena{
                  id
                  Market{
                    weaponList{
                      id
                      name
                      size
                    }
                    armorList{
                      id
                      name
                      shield
                    }
                  }
                }
                
                weaponList{
                    name
                }
            }
        }`
  }
})
  .then(warriors => {
    const theUnarmed = warriors.data.data.warriors.filter(item => {
      return (
        item.show &&
        item.weaponList.length === 1 &&
        item.weaponList[0].name === "Fists" &&
        item.username === "CPU"
      );
    });
    theUnarmed.map(item => {
      const roll = d6(2) + 2;
      const armSelection = item.Arena.Market.weaponList[roll - 1].id;
      const fullArmorList = item.Arena.Market.armorList;
      const armorWithoutShield = fullArmorList.filter(item => {
        return !item.shield;
      });

      let armorGroup = [];
      if (armSelection.size === "heavy") {
        const roll2 = d6(1) + 1;
        const armorSelection = armorWithoutShield[roll2 - 1];
        armorGroup.push(armorSelection.id);
      } else {
        const roll2 = d6(1) + 2;
        const armorSelection = fullArmorList[roll2 - 1];

        if (armorSelection.shield) {
          const roll3 = d6(1) + 1;
          const secondArmor = armorWithoutShield[roll3 - 1];
          armorGroup = [armorSelection.id, secondArmor.id];
        } else {
          armorGroup.push(armorSelection.id);
        }
      }

      const armorIdList = [...item.armorIdList, ...armorGroup];
      const weaponsIdList = [...item.weaponsIdList, armSelection];

      console.log(`${item.name} load-out: `, armorIdList, weaponsIdList);
      console.log();

      axios({
        url: `http://localhost:3001/graphql`,
        method: "POST",
        data: {
          query: `mutation{
            updateWarrior(id:"${item.id}",
            weaponsIdList: "${weaponsIdList}",
            armorIdList: "${armorIdList}"
            ){
              id
              name
            }
          }`
        }
      })
        .then(newWarrior => console.log(newWarrior.data))
        .catch(error => console.log(`error: `, error.response.data))
        .finally(() => {
          console.log(`All done with saving the warrior update!`);
        });
    });
  })
  .catch(error => console.log(error))
  .finally(() => {
    console.log(`All done!`);
  });
