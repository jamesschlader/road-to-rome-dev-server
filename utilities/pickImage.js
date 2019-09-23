const maleImages = require("../StaticData/maleImages");
const femaleImages = require("../StaticData/femaleImages");

const pickImage = bool => {
  return bool
    ? Math.floor(Math.random() * (maleImages.length - 1))
    : Math.floor(Math.random() * (femaleImages.length - 1));
};

const getImage = bool => {
  return bool
    ? maleImages[Math.floor(Math.random() * (maleImages.length - 1))]
    : femaleImages[Math.floor(Math.random() * (femaleImages.length - 1))];
};

module.exports = { pickImage, getImage };
