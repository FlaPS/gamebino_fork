import * as Types from './oldTypes'
import * as fs from 'fs'
import * as R from 'ramda'
import {connect} from 'mongodb'
import {Readable} from 'stream'
import * as T from 'se-iso/src/store/'
import createMongoConnection from '../dataSources/createMongoConnection'
import {createSchema, ExtractProps, Type} from 'ts-mongoose'
import {getMongoRepository} from 'se-iso/src/getMongoRepository'

const fileName = 'state.json'

const log = console.log

const schema = createSchema({
    timestamp: Type.number(),
    type: Type.string(),
    guid: Type.string(),
    payload: Type.mixed(),
})

type EventObj = ExtractProps<typeof schema>

const run = async ()=> {
    const db = await createMongoConnection({uri: 'mongodb://localhost/se-prod'})//await connect()).db()

    const Events = getMongoRepository(db.connection, 'events', schema)
    // db.connection.collection('events').find().stream()
    const eventCursor = Events.find({type: "users/patch"}).cursor()


    const hours = R.times(R.identity, 25)
    async function* eventsToSeries(source: Readable) {
        let serie: EventObj[] = []
        let next: ExtractProps<typeof schema>

        for await (next of source) {
            if(serie.length === 0) {
                serie = [next]
                continue
            }
            const prev: ExtractProps<typeof schema> = serie[serie.length - 1]
            const diff = next.timestamp - prev.timestamp

            if( next.type.endsWith('/patch') &&
                prev.type === next.type &&
                next.payload.userId != undefined &&
                diff < 5000 &&
                next.payload.balance !== undefined
            ) {
                serie = [...serie, next]
            } else {
                if(serie.length > 1)
                    yield serie
                serie = [next]
            }
        }
        if (serie.length > 1) {
            yield serie;
        }
    }


    async function logEventSeries(lineIterable) {
        let line: EventObj[]
        let i = 0

        for await ( line of lineIterable) {
            console.log('\n\nSerie found', i)
            i++
            console.log(line.length)

            for (let index = 0; index < line.length; index++){
                const e = line[index]
                const out = index === 0
                    ? R.pick(Object.keys(R.difference(e as any, line[1] as any)), e)
                    : R.difference(line[index - 1] as any, e as any)
                console.log(
                    e.timestamp+':',
                    e.payload.userId,
                    e.type,
                    {balance: e.payload.balance}
                )
            }



        }
    }

   await logEventSeries(eventsToSeries(eventCursor))

}

run().then( c => console.log('Done!'))