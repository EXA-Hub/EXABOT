"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barges = void 0;
function barges(options, argv) {
  if (argv === void 0) {
    argv = process.argv.slice(2);
  }
  if (
    options.filter(function (i) {
      return i.default;
    }).length > 1
  )
    throw new Error("More than one default option is not allowed");
  var result = { _unknown: {} };
  var aliases = {};
  var splitargv = argv
    .join(" ")
    .split(" --")
    .filter(function (i) {
      return !!i && i != "-" && i != "--";
    })
    .map(function (i) {
      return i.trim();
    });
  for (var index in options) {
    var option = options[index];
    if (!option.name)
      throw new Error("Option name should not be an empty string");
    if (!option.aliases || !option.aliases.length) continue;
    for (var _i = 0, _a = option.aliases; _i < _a.length; _i++) {
      var alias = _a[_i];
      aliases[alias] = option.name;
    }
  }
  var _loop_1 = function (key) {
    var split = key.split(" ");
    var name = split.shift().replace("--", "").replace("-", "");
    if (!argv.includes("-" + name) && !argv.includes("--" + name)) {
      var defaultOption = options.find(function (option) {
        return option.default;
      });
      if (defaultOption) result[defaultOption.name] = defaultOption.type(key);
      else result._unknown._ = key;
    } else {
      if (aliases[name]) name = aliases[name];
      var option = options.find(function (option) {
        return option.name == name;
      });
      var value = split.join(" ") || true;
      if (!option) result._unknown[name] = value;
      else result[name] = option.type(value);
    }
  };
  for (var _b = 0, splitargv_1 = splitargv; _b < splitargv_1.length; _b++) {
    var key = splitargv_1[_b];
    _loop_1(key);
  }
  return result;
}
exports.barges = barges;
