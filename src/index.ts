import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import {buildSchema} from 'type-graphql'
import express from "express";
import cors from 'cors'

import mikroConfig from "./mikro-orm.config";
import { __prod__ } from "./constants";
import "reflect-metadata";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig)
  await orm.getMigrator().up()
  
  const app = express()

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }))
  
  
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false
    }),
    context: ({req, res}) => ({ em: orm.em, req, res })
  })
  
  
  apolloServer.applyMiddleware({ app, cors: {origin: false} })
  app.listen(4000, () => {
    console.log('Server started on localhost:4000')
  })
}
  
main().catch(err => {
  console.log(err)
})