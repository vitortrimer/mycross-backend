"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express_1 = __importDefault(require("express"));
const core_1 = require("@mikro-orm/core");
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    await orm.getMigrator().up();
    const app = (0, express_1.default)();
    app.use((_req, _res, next) => {
        core_1.RequestContext.create(orm.em, next);
    });
    app.get("/", (_req, res) => {
        res.status(200).send({ success: true, message: "This is where it all starts!!!" });
    }, app.post("/user", (_req, res) => {
        res.status(200).send({ success: true, message: "This is where it all starts!!!" });
    }));
    app.listen(4000, () => {
        console.log('Server started on localhost:4000');
    });
};
main().catch(err => {
    console.log(err);
});
//# sourceMappingURL=index.js.map