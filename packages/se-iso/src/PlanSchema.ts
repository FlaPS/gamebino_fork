import {createSchema, ExtractDoc, Type} from 'ts-mongoose'
import {ProfileSchema, ProfileVO, ProfileVO} from './ProfileVO'

export const DishPartSchema = createSchema({
    part: Type.number(),
    name: Type.string(),
    weight: Type.number(),

}, {strict: false, versionKey: false, _id: false, id: false})

export const DishSchema = createSchema({
    recipe: Type.string(),
    list: Type.array().of(DishPartSchema)
}, {strict: false, versionKey: false, _id: false, id: false})

export const DaySchema = createSchema({
    breakfast: Type.object().of(DishSchema),
    snack1: Type.object().of(DishSchema),
    snack2: Type.object().of(DishSchema),
    snack3: Type.object().of(DishSchema),
    supper: Type.object().of(DishSchema),
    dinner: Type.object().of(DishSchema),
}, {strict: false})

export const PlanSchema = createSchema({
    _id: Type.objectId({select: false, required: true, auto: true}),
    planId: Type.string({required: true}),
    userId: Type.string(),
    isExternal: Type.boolean(),
    profile: Type.object().of(ProfileSchema),
    days: Type.mixed(),
    isPayed: Type.boolean(),
    isPayedByClient: Type.boolean(),
    scheme: Type.mixed(),
    paidAt: Type.date(),

    isDemo: Type.boolean(),
    state: Type.mixed(),
    isPersonalPlan: Type.boolean(),
    orderTimestamp: Type.number(),

    removed: Type.boolean({select: false}),
}, {strict: false, versionKey: false, timestamps: true})

export type PlanDoc = ExtractDoc<typeof PlanSchema>
