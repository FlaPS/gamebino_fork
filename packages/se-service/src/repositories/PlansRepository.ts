import { Document, Schema } from 'mongoose'
import mongoose from 'mongoose'
import * as autoIncrement from 'mongoose-auto-increment'
import {SEServiceState} from '../store/serviceDuck'
import {MongoConnection} from '../dataSources/createMongoConnection'
import { PlanVO } from 'se-iso'
import {PlanSchema} from 'se-iso/src/PlanSchema'

export interface IPlan extends Document, PlanVO {}


export function PlanModel(mongooseConnection: mongoose.Connection) {
    return mongooseConnection.model<IPlan>(
        'plan',
        PlanSchema,
    )
}


const PlansRepository = (mongoose: mongoose.Connection) => {
    const Model = PlanModel(mongoose)

    const getById = async (id: string): Promise<PlanVO> => {
        return (await Model.findOne({ planId: id }).lean())
    }

    const getAll = async (): Promise<PlanVO[]> => {
        return (await Model.find({removed: undefined}).sort({_id: -1}).lean())
    }

    const updateById = async (item: PlanVO): Promise<PlanVO> => {
        return (await Model.findOneAndUpdate
            ({ planId: item.planId },
            item,
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }))
    }

    const removeById = async (item): Promise<any> => {
        const result = await Model.findOneAndUpdate(
            {planId: item},
            {removed: true},
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }).lean()
        return result
    }

    const create = async (item: PlanVO): Promise<PlanVO> => {
        const newFullProfile = await Model.create(item)
        return newFullProfile
    }

    const removeAll = async (): Promise<any> =>
       await Model.deleteMany({})

    return {
        getById,
        updateById,
        create,
        getAll,
        removeAll,
        removeById,
        Model
    }
}

// FullProfileRepo(mongoose.connection).getById(1).then(o => o.)
export default PlansRepository
