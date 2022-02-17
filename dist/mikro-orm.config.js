"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { __prod__ } = require("./constants");
const path_1 = __importDefault(require("path"));
const user_1 = require("./entities/user");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [user_1.User],
    dbName: 'mycross',
    password: 'vitor',
    port: 5432,
    type: 'postgresql',
    debug: !__prod__
};
//# sourceMappingURL=mikro-orm.config.js.map