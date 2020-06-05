import {ProfileVO} from '../ProfileVO'
import {PlanVO} from '../getPlanDigest'
import * as FSA from '@sha/fsa'
import * as R from 'ramda'
import {RecipeVO} from './recepiesDuck'

import {AsyncStatus, asyncStatuses, FactoryAnyAction, reducerWithInitialState} from '@sha/fsa'

import {now, swap} from '../../../utils/src'
import {SEBootstrap} from './bootstrapDuck'
import {createSchema, ExtractProps, Type} from 'ts-mongoose'
import {ExactType} from 'io-ts'
import {SEClientState} from '../../../se-mobile-front/src/store/clientReducer'
import {SEISOState} from '../SEISOState'

export type DisplayNameAssign = ExtractProps<typeof DisplayNameAssignSchema>


export type ClientType = typeof clientTypes[number]
const clientTypes = ['offline', 'online'] as const
export const clientTypesOptions = [
    {
        value: 'offline',
        label: 'Оффлайн',
    },
    {
        value: 'online',
        label: 'Онлайн',
    }
]

export type UserType = 'personal' | 'trainer' | 'blogger' | 'clubOwner' | 'doctor' | 'other'
export const userTypes = ['personal', 'trainer', 'blogger' , 'clubOwner' , 'doctor' , 'other'] as const

export type PlanCustomDecorScheme =  {
    schemeName?: string
    fullName?: string
    website?: string
    phone?: string
    photo?: string
    instagram?: string
    extraInfo?: string
    hideContacts?: boolean
    bgSet?: 'default' | 'none' | 'brand'
    useCover?: boolean
} & PlanBrandDecorScheme

export type PlanBrandDecorScheme = {
    schemeName?: string
    coverBg?: string
    menuBg?: string
    recipesBg?: string
    instructionBg?: string
    shoppingListBg?: string
}

export type PlanDecorScheme = PlanBrandDecorScheme & PlanCustomDecorScheme

export const RefereeSchema = createSchema({
    userId: Type.string({required: true}),
    firstPaidAt: Type.date(),
}, {strict: false, id:false, _id: false, versionKey: false})


export const DisplayNameAssignSchema = createSchema({
    value: Type.string({required: true, unique: true, trim: true}),
    timestamp: Type.number({required: true}),
}, {strict: false, id:false, _id: false, versionKey: false})



export const UserSchema = createSchema({
        _id: Type.objectId({select: false, required: true, auto: true}),
        userId: Type.string({required: true, unique: true}),
        website: Type.string(),
        fullName: Type.string(),

        email: Type.string({required: true, unique: true, trim: true, toLowerCase: true}),
        password:  Type.string({required: true, unique: true, trim: true}),
        resetPasswordGuid:  Type.string(),

        phone: Type.string({trim: true}),

        clientsType: Type.string({  enum: clientTypes, default: clientTypes[0] }),
        countryName: Type.string({trim: true}),
        cityName: Type.string({trim: true}),
        balance: Type.number({ default: 0}),
        verifyDocs: Type.array({ default: []}).of(Type.string()),
        verify: Type.string({enum: asyncStatuses}),
        vk: Type.string({trim: true}),
        instagram: Type.string({trim: true}),
        transactions: Type.array({default: []}).of(Type.mixed()),
        type: Type.string({enum: userTypes}),
        referees: Type.array({ default: []}).of(RefereeSchema),
        referrerUserId: Type.string(),
        referralLink: Type.string(),
        planDecor: Type.mixed(),
        isTestUser: Type.boolean(),

        campaignId: Type.string(),

        mustNotifiedAboutCashback: Type.boolean(),

        trainerData: Type.object().of({
            backgroundImage: Type.string(),
            description: Type.string({trim: true}),
            displayNames: Type.array({default: []})
                .of(DisplayNameAssignSchema)
        }),

        removed: Type.boolean({select: false}),
    },
    {  strict: true, timestamps: true, versionKey: false}
)


export type UserVO = ExtractProps<typeof UserSchema>

const u:UserVO = {} as any
//u.trainerData.displayNames[0]
export type UserTypeOption = {
    label: string
    value: UserType
}

const usersDuckRaw = FSA.createCRUDDuck<UserVO, 'userId'>('users', 'userId',
    {
        balance: 0,
        transactions:[],
        referees: [],
        verifyDocs: [],
        verify: 'unset',
        planDecor: {
            customSchemes: [],
            brandSchemes: []
        },
        trainerData: {
            displayNames: []
        }
    }

)


export const userTypeOptions: UserTypeOption[] = [
    {
        label: 'Пользователь',
        value: 'personal',
    },
    {
        label: 'Тренер',
        value: 'trainer',
    },
    {
        label: 'Блогер',
        value: 'blogger',
    },
    {
        label: 'Представитель фитнес-клуба',
        value: 'clubOwner',
    },
    {
        label: 'Диетолог/Нутрицолог',
        value: 'doctor',
    },
    {
        label: 'Другое',
        value: 'other',
    },
]



const factory = usersDuckRaw.factory

export type RegisterRequestPayload = {user: UserVO, plan?: PlanVO}


const exampleRequest = {
    "TerminalKey":"1520344183884DEMO",
    "OrderId":"smarteat/1575036234637",
    "Success":true,
    "Status":"CONFIRMED",
    "PaymentId":148466998,
    "ErrorCode":"0",
    "Amount":1000000,
    "CardId":3748227,
    "Pan":"430000******0777",
    "ExpDate":"1122",
    "Token":"63fb68fc28d0ffa1ee06e8d9659d086be7ab9ea91d4337d764dbda1721b65a49"
}

export type TinkoffSuccessIncomingRequest = typeof exampleRequest

export const actions = {
    ...usersDuckRaw.actions,
    registered: factory.async<RegisterRequestPayload>('register', {persistent: true}),
    fetchUsers: factory.async<undefined, SEBootstrap>('fetchUsers', ),
    verify: factory.async<{userId: string}, boolean>('verify', {persistent: true}),
    displayNameAssigned: factory<{userId: string, displayName: string}>('setDisplayName', {persistent: true}),
    refereeFirstPlanPaid: factory<{userId: string, referee: string}>('refereeFirstPlanPaid'),
    refereeAdded: factory<{userId: string, referee: string}>('refereeAdded'),
    balanceWithdrawnByAdmin: factory<{amount: number ,comment?: string}>('balanceWithdrawnByAdmin', {persistent: true}),
    balanceDepositedByAdmin: factory<{amount: number ,comment?: string}>('balanceDepositedByAdmin', {persistent: true}),


    balanceChanged: factory<{amount: number, userId: string, reason?: string}>('balanceChanged'),
    referralRegistrationAwarded : factory<{userId: string}>('referralRegistrationAwarded', {persistent: true}),
    referralFirstPaymentAwarded : factory<{userId: string}>('referralFirstPaymentAwarded', {persistent: true}),
    refereeRegistrationAwarded: factory<{userId: string}>('refereeRegistrationAwarded', {persistent: true} ),

    tinkoffDeposited: factory<TinkoffSuccessIncomingRequest>('tinkoffDeposited', {persistent: true})
}

const reducer = (state: UserVO[], action: any) => {

    let newState = usersDuckRaw.reducer(state, action)

    if(action.type.startsWith(actions.verify.type)) {
        if(actions.verify.started.isType(action)) {
            const userIndex = newState.findIndex(R.propEq('userId', action.payload.userId))
            newState = R.set(R.lensPath([userIndex, 'verify']), 'started', newState)
        }
        if(actions.verify.done.isType(action)) {
            const userIndex = newState.findIndex(R.propEq('userId', action.payload.params.userId))
            newState = R.set(R.lensPath([userIndex, 'verify']), 'done', newState)
        }
        if(actions.verify.failed.isType(action)) {
            const userIndex = newState.findIndex(R.propEq('userId', action.payload.params.userId))
            newState = R.set(R.lensPath([userIndex, 'verify']), 'failed', newState)
        }
        return newState
    }

    else if(actions.refereeAdded.isType(action)) {

    }
    else if(actions.displayNameAssigned.isType(action)) {

        const {displayName,userId} = action.payload
        const displayNameUserIndex = newState.findIndex(u => {
            if(!u.trainerData)
                return false
            const result = u.trainerData.displayNames.find(({value}) => value === displayName)
            return result
        })
        const timestamp = now()
        const userIndex = newState.findIndex(u => userId === u.userId)
        if(displayNameUserIndex === -1) {

            const lastUserDisplayNameTimestamp = newState[userIndex].trainerData.displayNames[0].timestamp

            //if (timestamp - lastUserDisplayNameTimestamp  > 24 * 60 * 60 * 1000 || isNaN(lastUserDisplayNameTimestamp)) {
                let result = R.assocPath(
                    [userIndex, 'trainerData', 'displayNames'],
                    [{value: displayName, timestamp}, ...newState[userIndex].trainerData.displayNames],
                    newState,
                )

                result = R.assocPath(
                    [userIndex, 'displayName'],
                    displayName,
                    result,
                )
                return result
            //}
        }
        else if(newState[displayNameUserIndex].userId === userId) {
            const user = newState[displayNameUserIndex]

            const nameIndex = user.trainerData.displayNames.findIndex(({value}) => value === displayName)
            let newDisplayNames =swap(nameIndex, 0, user.trainerData.displayNames)
            newDisplayNames = R.assocPath([0, 'timestamp'], timestamp, newDisplayNames)
            newState = R.assocPath(
                                [displayNameUserIndex, 'trainerData', 'displayNames'],
                                newDisplayNames,
                                newState,
                            )
            newState = R.assocPath(
                [displayNameUserIndex, 'displayName'],
                displayName,
                newState,
            )
            return newState
        }

         return newState

    }

    if(action.userId) {
        const userId = action.userId
        const index = R.findIndex(R.propEq('userId', userId))(newState)
        const lens = R.lensIndex(index)
        const result = R.over(
            lens,
            (user) =>
                userReducer(user, action)
            ,
            newState
        )
        newState = result
    }
    return newState
}//actions.fetchUsers.asyncReducer

const userReducer = reducerWithInitialState({} as any as UserVO)
    .caseWithAction(actions.balanceDepositedByAdmin,
        (state, action) =>
            ({
                ...state,
                balance: Number(state.balance) + Number(action.payload.amount),
                transactions: R.prepend(action, state.transactions),
            })
    )
    .caseWithAction(actions.balanceWithdrawnByAdmin,
        (state, action) =>
            ({
                ...state,
                balance: state.balance - action.payload.amount,
                transactions: R.prepend(action, state.transactions),
            })
    )
    .caseWithAction(actions.balanceChanged,
        (state, action) =>
            ({
                ...state,
                balance: state.balance + action.payload.amount,
            })
    )
    .caseWithAction(
        actions.tinkoffDeposited,
        (state, action) =>
            ({
                ...state,
                balance: state.balance + action.payload.Amount / 100,
                transactions: R.prepend(action, state.transactions),
            })
    )



const   selectUserByEmail = (email: string) => (state: SEISOState) => {
    const users = state.app.bootstrap.users
    const userByEmail = users.find( user => user.email.toLowerCase() === email.toLowerCase())

    return userByEmail
}

export const usersDuck = {
    reducer,
    factory,
    actions,
    ...usersDuckRaw.optics,

    selectUserByEmail:
        selectUserByEmail,

    selectUserIdByEmail: (email: string) => (state: SEISOState) => {
        const user = selectUserByEmail(email)(state)
        return user ? user.userId : undefined
    },
    selectCurrentUser: (state: SEClientState) =>
        state.app.bootstrap.users[0],


    selectIsDisplayNameBusy: (displayName: string) => (state: SEISOState) => {
        displayName = displayName.toLowerCase()
        const users = state.app.bootstrap.users
        const user = users.find( (u: UserVO , index) => {
                if(!u.trainerData)
                    return false
                return  u.trainerData.displayNames.find(i => i.value.toLowerCase() === displayName)
            }
        )
        return user ? 1 : 0
    }
}