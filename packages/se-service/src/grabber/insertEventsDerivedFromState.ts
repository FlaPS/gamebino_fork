import {Readable} from 'stream'
import createMongoConnection from '../dataSources/createMongoConnection'
import {createSchema, ExtractProps, Type} from 'ts-mongoose'
import {getMongoRepository} from 'se-iso/src/getMongoRepository'
import {EventObj, eventSchema, SEBootstrap} from './oldTypes'
import { applyMiddleware, createStore } from 'redux'
import configureServiceStore from '../store/configureServiceStore'
import {serviceDuck} from '../store/serviceDuck'
import {getTimer} from '@sha/utils'


export default async (bootstrap: SEBootstrap)=> {
    const db = await createMongoConnection({uri: 'mongodb://localhost/se-prod'})//await connect()).db()

    const Events = getMongoRepository(db.connection, 'events', eventSchema)
    // db.connection.collection('events').find().stream()

    const storeFromEvents = createStore(serviceDuck.reducer, {app:{bootstrap}})
    const cursor = Events.find().cursor()
    let i = 0

    console.time('play-100-events')
    await cursor.eachAsync( (e:EventObj) => {
        storeFromEvents.dispatch(e)
        i++
        if(i % 100 === 0) {
            console.timeLog('play-100-events')
        }
    })

    // const
    async function eventsToSeries(source: Readable) {

    }

    console.log('calculating event based state')

}
