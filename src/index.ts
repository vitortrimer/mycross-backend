import "reflect-metadata";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { MikroORM, RequestContext } from "@mikro-orm/core";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig)
  await orm.getMigrator().up()
  
  const app = express()
  
  
  app.use((_req, _res, next) => {
    RequestContext.create(orm.em, next);
  });


  app.get("/", (_req, res) => {
    orm.em
    res.status(200).send({ success: true, message: "This is where it all starts!!!" })
  });

  app.post("/user", async (req, res) => {
    res.status(200).send({ success: true, message: "This is where it all starts!!!" });
  })

  app.listen(4000, () => {
    console.log('Server started on localhost:4000')
  })
}
  
main().catch(err => {
  console.log(err)
})