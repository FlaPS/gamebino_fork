import {defaultSEISOConfig} from 'se-iso/src/SEISOConfig'
import {MongoClient} from 'mongodb'
import R from 'ramda'


export const defaultSEServiceConfig = {
  ...defaultSEISOConfig,
  type: 'service',
  http: {
    "port": 8084,
    "host": "0.0.0.0",
    "apiVersion": "v0.1"
  },
  mongodb: {
    uri: 'mongodb://localhost/gamebino',
  },
  pdfWorkers: 0,
  notifications: {
    cashbackMailTimeout: 20,
  },
  //
}


export const findConfig = async (uri: string = "mongodb://localhost:27017", dbName = "gamebino", defaultConfig = defaultSEServiceConfig) => {

  const mongoClient =  await MongoClient.connect(uri)
  const db = mongoClient.db(dbName)
  const cursor = await db.collection('config').find({type : 'service'}).toArray()
  const savedConfig = cursor[0] || {}

  if (!savedConfig) {
    console.log(`Service config not found in ${uri}/${dbName}, insert default config`)

  }

  console.log('Saved config', savedConfig)
  const mergedConfig: SEServiceConfig = R.mergeDeepRight(defaultConfig, savedConfig)
  await db.collection('config').replaceOne({type: 'service'}, mergedConfig, {upsert: true} )
  console.log('Merged config', mergedConfig)
  await mongoClient.close()

  return mergedConfig
}

export const updateConfig = async (uri: string = "mongodb://localhost:27017", dbName = "smart-eat", newConfig = defaultSEServiceConfig) => {

  const mongoClient =  await MongoClient.connect(uri)
  const db = mongoClient.db(dbName)

  await db.collection('config').replaceOne({type: 'service'}, R.omit(['_id'], newConfig), {upsert: true} )
  await mongoClient.close()

  return newConfig
}

export type SEServiceConfig = typeof defaultSEServiceConfig
