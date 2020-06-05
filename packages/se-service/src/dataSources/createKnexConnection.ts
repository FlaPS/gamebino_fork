import knex from 'knex'
import { TypedKnex } from './typedKnex'

const defaultKnexConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'cryptedge',
}

const createKnexConnection = (config: typeof defaultKnexConfig = defaultKnexConfig) =>
  new TypedKnex(
    knex({
      client: 'mysql',
      connection: config,
    }),
  )



export type KnexConnection = TypedKnex

export default createKnexConnection
