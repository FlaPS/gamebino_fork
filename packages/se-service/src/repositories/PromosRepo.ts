import { Document, Schema } from 'mongoose'
import mongoose from 'mongoose'
import {PromoVO} from 'se-iso/src/store/promoCodesDuck'
import {Type} from 'ts-mongoose'


export interface IPromo extends Document, PromoVO {}

export const PromoSchema: Schema = new Schema(
    {
        promoId: { type: String, required: true, unique: true},
        removed: Type.boolean({select: false}),
    },
    { versionKey: false , strict: false },
)

export function PromoModel(mongooseConnection: mongoose.Connection) {
    return mongooseConnection.model<IPromo>(
        'promocodes',
        PromoSchema,
    )
}

const PromosRepository = (mongoose: mongoose.Connection) => {
    const Model = PromoModel(mongoose)

    const getById = async (promoId: string): Promise<PromoVO> => {
        return (await Model.findOne({ promoId }).lean())
    }

    const getAll = async (): Promise<PromoVO[]> => {
        return (await Model.find({removed: undefined}).sort({_id: -1}).lean())
    }

    const updateById = async (item: PromoVO): Promise<PromoVO> => {

        const result = (await Model.findOneAndUpdate({ promoId: item.promoId },
            item, 
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            })
        )

        console.log('Promocode updated', result)

        return result
    }
    const removeById = async (item): Promise<any> => {
        const result = await Model.findOneAndUpdate(
            {promoId: item},
            {removed: true},
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }).lean()
        return result
    }
    const create = async (item: PromoVO): Promise<PromoVO> => {
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
export default PromosRepository
