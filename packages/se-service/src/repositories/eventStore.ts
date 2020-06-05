import mongoose from 'mongoose'
import uuid from 'uuid/v4'
import {Type, createSchema, ExtractProps, ExtractDoc} from 'ts-mongoose'
import getMongoRepository from 'se-iso/src/getMongoRepository'

export const EventSchema = createSchema({
    guid: Type.string({unique: true, required: true}),
    type: Type.string({required: true}),
    payload: Type.mixed(),
    tags: Type.array().of(Type.string()),
    userId: Type.string({}),
    meta: Type.mixed(),
    isCommand: Type.boolean({default: false}),
    parentGuid: Type.string(),
}, { timestamps: { createdAt: true } })

export type EventDoc = ExtractDoc<typeof EventSchema>

export type EventVO = ExtractProps<typeof EventSchema>

const eventStore = async (mongoose: mongoose.Connection) => {

    const Model = getMongoRepository(mongoose, 'events', EventSchema)

    const create = async (item: EventVO): Promise<EventVO> => {
        if(!item.guid)
            item.guid = uuid()

        const doc = await Model.create(item)

        return doc.toObject()
    }

    const removeAll = async (): Promise<any> =>
        await Model.deleteMany({})

    const getAll = async (): Promise<any> =>
        await Model.find({})

    return {
        create,
        removeAll,
        getAll,
        Model,
    }
}

export default eventStore
