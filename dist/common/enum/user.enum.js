"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatusEnum = exports.ProvideEnum = exports.ROLEENUM = exports.GENDERENUM = void 0;
var GENDERENUM;
(function (GENDERENUM) {
    GENDERENUM[GENDERENUM["MALE"] = 0] = "MALE";
    GENDERENUM[GENDERENUM["FEMALE"] = 1] = "FEMALE";
})(GENDERENUM || (exports.GENDERENUM = GENDERENUM = {}));
var ROLEENUM;
(function (ROLEENUM) {
    ROLEENUM[ROLEENUM["USER"] = 0] = "USER";
    ROLEENUM[ROLEENUM["ADMIN"] = 1] = "ADMIN";
})(ROLEENUM || (exports.ROLEENUM = ROLEENUM = {}));
var ProvideEnum;
(function (ProvideEnum) {
    ProvideEnum[ProvideEnum["SYSTEM"] = 0] = "SYSTEM";
    ProvideEnum[ProvideEnum["GOOGLE"] = 1] = "GOOGLE";
})(ProvideEnum || (exports.ProvideEnum = ProvideEnum = {}));
var AccountStatusEnum;
(function (AccountStatusEnum) {
    AccountStatusEnum[AccountStatusEnum["ACTIVE"] = 0] = "ACTIVE";
    AccountStatusEnum[AccountStatusEnum["INACTIVE"] = 1] = "INACTIVE";
    AccountStatusEnum[AccountStatusEnum["ARCHIVED"] = 2] = "ARCHIVED";
})(AccountStatusEnum || (exports.AccountStatusEnum = AccountStatusEnum = {}));
