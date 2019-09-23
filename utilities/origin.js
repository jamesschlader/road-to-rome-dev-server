function origin(rand = Math.floor(Math.random() * 100)) {
  const _rand = rand;
  if (_rand < 21) {
    return "roma";
  } else if (20 < _rand && _rand < 41) {
    return "grea";
  } else if (40 < _rand && _rand < 61) {
    return "afr";
  } else if (60 < _rand && _rand < 71) {
    return "anci";
  } else if (70 < _rand && _rand < 76) {
    return "cop";
  } else if (75 < _rand && _rand < 81) {
    return "gal";
  } else if (80 < _rand && _rand < 86) {
    return "gmca";
  } else if (85 < _rand && _rand < 91) {
    return "heb";
  } else if (90 < _rand && _rand < 96) {
    return "occ";
  } else if (95 < _rand && _rand < 101) {
    return "scaa";
  } else {
    return "roma";
  }
}

module.exports = origin;
