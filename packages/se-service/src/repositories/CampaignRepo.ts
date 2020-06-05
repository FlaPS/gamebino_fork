import { Document, Schema } from 'mongoose'
import mongoose from 'mongoose'

import { CampaignVO } from 'se-iso'
import {createSchema, Type} from 'ts-mongoose'


export const CampaignVisitSchema = createSchema({
    createdAt: Type.date(),

})

export const CampaignSchema = createSchema({
    campaignId: Type.string({unique: true, required: true}),
    name: Type.string(),
    code: Type.string({required: true}),

    startsAtISO: Type.date(),
    endsAtISO: Type.date(),

    budget: Type.mixed(),
    description: Type.string(),


    visits: Type.array().of(Type.mixed()),
    leads: Type.array().of(Type.mixed()),


    removed: Type.boolean({select: false}),
}, { timestamps: { createdAt: true, updatedAt: true }, versionKey: false })

export interface ICampaign extends Document, CampaignVO {}


export function PlanModel(mongooseConnection: mongoose.Connection) {
    return mongooseConnection.model<ICampaign>(
        'campaign',
        CampaignSchema,
    )
}


const CampaignsRepository = (mongoose: mongoose.Connection) => {
    const Model = PlanModel(mongoose)

    const getById = async (id: string): Promise<ICampaign> => {
        return (await Model.findOne({ planId: id }).lean())
    }

    const getAll = async (): Promise<CampaignVO[]> => {
        return (await Model.find({removed: undefined}).sort({_id: -1}).lean())
    }

    const updateById = async (item: CampaignVO): Promise<CampaignVO> => {
        return (await Model.findOneAndUpdate
        ({ campaignId: item.campaignId },
            item,
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }))
    }

    const removeById = async (item): Promise<any> => {
        const result = await Model.findOneAndUpdate(
            {campaignId: item},
            {removed: true},
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }).lean()
        return result
    }

    const create = async (item: CampaignVO): Promise<CampaignVO> => {
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
export default CampaignsRepository