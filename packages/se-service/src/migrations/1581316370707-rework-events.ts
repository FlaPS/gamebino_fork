/**
 * Make any changes you need to make to the database here
 */
import eventStore, {EventDoc} from '../repositories/eventStore'
import {connection} from 'mongoose'
import createMongoConnection from '../dataSources/createMongoConnection'
import config from './migrate.json'
import configureServiceStore, {ServiceStore} from '../store/configureServiceStore'
import UsersRepository from '../repositories/UsersRepository'
import {SagaOptions} from '../sagas/SagaOptions'
import {UserVO} from 'se-iso/src/store/usersDuck'


import migrateConfig  from './migrate.json'
import {mapUser} from './rework-events/rework-events-mapping'
export async function up () {
    console.log('up!')
    const store = await configureServiceStore({
        mongodb: {
            uri: migrateConfig.dbConnectionUri
        }
    })

    console.log('connected!')

    await migrateMongoUsers(store)
    //await updateEventTags(repos)

    throw 'Fuck!'

    //Write migration here
}

const reducePlansBoilerPlate = async (store) => {

}


const migrateMongoUsers = async (store: ServiceStore) => {
    const repo = store.options.UsersRepo
    let events  = (await repo.getAll())

    console.log('Update mongo users, length', events.length)

    for(let i = 0; i < 1; i++) {
        const s =events[i]
        const u = JSON.parse(JSON.stringify(s)).state
        console.log(u)
        const mapped = mapUser(u)
        //repo.Model.replaceOne({userId: u.userId})
    }
}

async function updateEventTags({eventStore}: SagaOptions)  {
    let events  = await eventStore.getAll()

    console.log('Update events tag by user total events', events.length)

    for(let i = 0; i < events.length; i++) {
        const e = events[i]
        if(e.payload.userId || e.payload.userId) {
            console.log('update event', e.guid)
            e.tags = ['user-' + (e.payload.userId || e.payload.userId)]
            await e.save({validateBeforeSave: true})
        }
    }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down () {
    console.log('down!')
  // Write migration here
}
