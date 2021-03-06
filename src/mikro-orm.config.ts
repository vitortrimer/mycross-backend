import { User } from "./entities/user";
import { __prod__ } from "./constants";
import { MikroORM } from "@mikro-orm/core"
import path from 'path'

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    
  },
  entities: [User],
  dbName: 'mycross',
  password: 'vitor',
  port: 5432,
  type: 'postgresql',
  debug: !__prod__
} as Parameters<typeof MikroORM.init>[0]