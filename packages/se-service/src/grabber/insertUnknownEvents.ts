import createMongoConnection from '../dataSources/createMongoConnection'
import {createStore} from 'redux'
import {SEBootstrap,EventObj,eventSchema} from './oldTypes'
import {serviceDuck} from '../store/serviceDuck'
import getMongoRepository from 'se-iso/src/getMongoRepository'

export default async (bootstrap: SEBootstrap)=> {
    const sourceDB = await createMongoConnection({uri: 'mongodb://localhost/se-'})//await connect()).db()
    const sourceEvents = getMongoRepository(sourceDB.connection, 'events', eventSchema)
    const sourceStore = createStore(serviceDuck.reducer, {app:{bootstrap}})
    const cursor = sourceEvents.find().lean().cursor()
    let i = 0
    const label = 'play events'
    console.time(label)
    await cursor.eachAsync( async (e:EventObj) => {
        sourceStore.dispatch(e)
        i++
        if(i % 100 === 0) {
            console.timeLog(label, i)
        }
    })
    console.log('Events total: '+i)
    console.timeEnd(label)

    console.log('calculating event based state')

}