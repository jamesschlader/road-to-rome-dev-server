function d6(factor = 1) {
  let sum = 0;
  for (let j = 0; j < factor; j++) {
    sum += Math.floor(Math.random() * 6 + 1);
  }
  return sum;
}

module.exports = d6;
