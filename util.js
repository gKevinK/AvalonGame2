module.exports.range = function (n) {
  return [...Array(n).keys()];
}

module.exports.randomRange = function (n) {
  var randarr = [];
  for (var i = 0; i < n; i++) {
    randarr.push(Math.random());
  }
  return module.exports.range(n).sort(function (a, b) {
    return randarr[a] - randarr[b];
  });
}

module.exports.shuffleCopy = function (array) {
  var randarr = [];
  for (var i = 0; i < array.length; i++) {
    randarr.push(Math.random());
  }
  return array.slice().sort(function (a, b) {
    return randarr[a] - randarr[b];
  });
}

module.exports.randomIn = function (num) {
  return Math.floor(Math.random() * num);
}