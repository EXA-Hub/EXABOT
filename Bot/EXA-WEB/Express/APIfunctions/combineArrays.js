const combineArrays = (first, second) => {
  return first.reduce((acc, val, ind) => {
    acc[val] = second[ind];
    return acc;
  }, {});
};

module.exports = combineArrays;
