"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionRoleManager = void 0;
var ReactionRoleManager = /** @class */ (function () {
  function ReactionRoleManager(messageReaction, user, config) {
    this.messageReaction = messageReaction;
    this.user = user;
    this.config = config;
    this.roleIds = undefined;
    this.member = undefined;
  }
  Object.defineProperty(ReactionRoleManager.prototype, "emoji", {
    get: function () {
      return this.messageReaction.emoji.id || this.messageReaction.emoji.name;
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(ReactionRoleManager.prototype, "ruleRoleIds", {
    get: function () {
      return __spreadArray(
        [],
        new Set(Object.values(this.config.emojiRoleMap).flat()),
        true
      );
    },
    enumerable: false,
    configurable: true,
  });
  ReactionRoleManager.prototype.setRoles = function () {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this._validateInput()];
          case 1:
            if (!_a.sent()) {
              return [2 /*return*/];
            }
            return [4 /*yield*/, this._handleUserReaction()];
          case 2:
            _a.sent();
            switch (this.config.policy) {
              case "once":
                return [
                  2 /*return*/,
                  this._memberHasSomeRoleInRuleRoles()
                    ? undefined
                    : this._addRolesToMember(),
                ];
              case "any":
                return [
                  2 /*return*/,
                  this._memberHasEveryRoleInRoles()
                    ? this._removeRolesFromMember()
                    : this._addRolesToMember(),
                ];
              case "unique":
              default:
                return [
                  2 /*return*/,
                  this._memberHasEveryRoleInRoles()
                    ? this._removeRolesFromMember()
                    : this._setRolesToMember(),
                ];
            }
            return [2 /*return*/];
        }
      });
    });
  };
  ReactionRoleManager.prototype._validateInput = function () {
    return __awaiter(this, void 0, Promise, function () {
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (
              !this.config ||
              this.user.bot ||
              this.messageReaction.message.channel.type === "DM"
            ) {
              return [2 /*return*/, false];
            }
            _a = !this._setRoleIds();
            if (_a) return [3 /*break*/, 2];
            return [4 /*yield*/, this._setMember()];
          case 1:
            _a = !_b.sent();
            _b.label = 2;
          case 2:
            if (_a) {
              return [2 /*return*/, false];
            }
            return [2 /*return*/, true];
        }
      });
    });
  };
  ReactionRoleManager.prototype._setRoleIds = function () {
    this.roleIds = this.config.emojiRoleMap[this.emoji];
    return Boolean(this.roleIds);
  };
  ReactionRoleManager.prototype._setMember = function () {
    var _a;
    return __awaiter(this, void 0, Promise, function () {
      var _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _b = this;
            return [
              4 /*yield*/,
              (_a = this.messageReaction.message.guild) === null ||
              _a === void 0
                ? void 0
                : _a.members.fetch(this.user),
            ];
          case 1:
            _b.member = _c.sent();
            return [2 /*return*/, Boolean(this.member)];
        }
      });
    });
  };
  ReactionRoleManager.prototype._handleUserReaction = function () {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        if (this.config.removeReaction) {
          this.messageReaction.users.remove(this.user);
        }
        return [2 /*return*/];
      });
    });
  };
  ReactionRoleManager.prototype._memberHasSomeRoleInRuleRoles = function () {
    var _this = this;
    return this.ruleRoleIds.some(function (roleId) {
      return _this.member.roles.cache.has(roleId);
    });
  };
  ReactionRoleManager.prototype._memberHasEveryRoleInRoles = function () {
    var _this = this;
    return this.roleIds.every(function (roleId) {
      return _this.member.roles.cache.has(roleId);
    });
  };
  ReactionRoleManager.prototype._removeRolesFromMember = function () {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        this.member.roles.remove(this.roleIds);
        return [2 /*return*/];
      });
    });
  };
  ReactionRoleManager.prototype._addRolesToMember = function () {
    return __awaiter(this, void 0, Promise, function () {
      return __generator(this, function (_a) {
        this.member.roles.add(this.roleIds);
        return [2 /*return*/];
      });
    });
  };
  ReactionRoleManager.prototype._setRolesToMember = function () {
    return __awaiter(this, void 0, Promise, function () {
      var currentRoleIds, roleIdsToSet;
      var _this = this;
      return __generator(this, function (_a) {
        currentRoleIds = this.member.roles.cache.map(function (role) {
          return role.id;
        });
        roleIdsToSet = __spreadArray(
          __spreadArray(
            [],
            currentRoleIds.filter(function (roleId) {
              return !_this.ruleRoleIds.includes(roleId);
            }),
            true
          ),
          this.roleIds,
          true
        );
        this.member.roles.set(roleIdsToSet);
        return [2 /*return*/];
      });
    });
  };
  return ReactionRoleManager;
})();
exports.ReactionRoleManager = ReactionRoleManager;
