import "reflect-metadata";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { MikroORM } from "@mikro-orm/core";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig)
    await orm.getMigrator().up()
    
    const app = express()
  

    app.listen(4000, () => {
      console.log('Server started on localhost:4000')
    })
  }
  
  main().catch(err => {
    console.log(err)
  })