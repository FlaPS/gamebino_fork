import { Document, Schema } from 'mongoose'
import mongoose from 'mongoose'
import * as autoIncrement from 'mongoose-auto-increment'
import {SEServiceState} from '../store/serviceDuck'
import {MongoConnection} from '../dataSources/createMongoConnection'
import { PlanVO } from 'se-iso'
import {UserSchema, UserVO} from 'se-iso/src/store/usersDuck'
import getMongoRepository from 'se-iso/src/getMongoRepository'

export interface IUser extends UserVO {}
/*
export const UserSchema: Schema = new Schema(
    {

        userId:  { type: String, required: true, unique: true},
        email:  { type: String, required: true, unique: true},
    },
    { versionKey: false , strict: false },
)

export function UserModel(mongooseConnection: mongoose.Connection) {
    return mongooseConnection.model<IUser>(
        'user',
        UserSchema,
    )
}*/



const UsersRepository = (mongoose: mongoose.Connection) => {
    const Model = getMongoRepository(mongoose, 'users', UserSchema)

    const getById = async (userId: string): Promise<UserVO> => {
        return (await Model.findOne({ userId }).lean())
    }

    const getAll = async () => {
        console.log('getting all users')
        const result = (await Model.find({removed: undefined}).sort({_id: -1}).lean())
        console.log('total users', result.length)
        return result
    }
    const updateById = async (item: UserVO): Promise<UserVO> => {
        const result = await Model.findOneAndUpdate(
                { userId: item.userId },
            item,
                {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }).lean()
        
        return result
    }
    const removeById = async (item): Promise<any> => {
        const result = await Model.findOneAndUpdate(
            { userId: item },
            {removed: true},
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }).lean()
        return result
    }
    const create = async (item: UserVO): Promise<UserVO> => {
        const newFullProfile = await Model.create({
            ...item,
        })
        console.log('user created', newFullProfile)
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
export default UsersRepository
