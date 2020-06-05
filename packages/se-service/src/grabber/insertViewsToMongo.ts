import * as Types from './oldTypes'
import * as fs from 'fs'
import * as R from 'ramda'
import {connect} from 'mongodb'
import {SEBootstrap} from './oldTypes'
import createMongoConnection from '../dataSources/createMongoConnection'
const fileName = 'state.json'

const log = console.log

export default async (state: SEBootstrap)=> {
    const {users, plans, promoCodes} = state
    console.log(users.length, plans.length, promoCodes.length)
    const mongoose = await createMongoConnection({uri: 'mongodb://localhost/se-prod'})
    const db = mongoose.connection.db
    let bulk = db.collection('users').initializeUnorderedBulkOp()
    let array: any[] = users
    let length = array.length

    for (let i = 0;i < length; i++) {
        const user = array[i]
        const id = user.userId

        bulk.find({id}).upsert().replaceOne({
            id,
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            state: user,
        })
        log('users', i)
    }

    await bulk.execute()

    bulk = db.collection('plans').initializeUnorderedBulkOp()
    array = plans
    length = array.length
    for (let i = 0;i < length; i++) {
        const plan = array[i]
        const id = plan.planId
        //const dUser = (await collection.findOne({id}))
        bulk.find({id}).upsert().replaceOne({
                id,
                planId: plan.planId,
                userId: plan.userId,
                state: plan,
            })
        log('plans', i)
    }
    await bulk.execute()



    bulk = db.collection('promocodes').initializeUnorderedBulkOp()
    array = promoCodes
    length = array.length
    for (let i = 0;i < length; i++) {
        const promocode = array[i]
        const id = promocode.id
        bulk.find({id}).upsert().replaceOne({
                id,
                state: promocode,
            })
        log('promocodes')
    }
    await bulk.execute()
}
