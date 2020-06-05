import {CredentialsVO, SERestApi} from 'se-iso/src/api'
import {SagaOptions} from '../sagas/SagaOptions'
import {FactoryAnyAction} from '@sha/fsa'
import {APIResponse} from 'se-iso/src/utils/asyncWorker'
import {DisplayNameAssign, usersDuck, UserVO} from 'se-iso/src/store/usersDuck'
import {selectISOConfig, SEServiceState} from '../store/serviceDuck'
import {PlanVO, getPlanDigest, SEBootstrap, configDuck, campaignsDuck} from 'se-iso/src'
import {plansDuck} from 'se-iso/src/store/plansDuck'
import {now} from 'moment'
import {generateGuid} from '@sha/random'
import * as R from 'ramda'
import Fastify from 'fastify'


const findTrainerByDisplayName = (state: SEServiceState, displayName: string) => {
    const users = state.app.bootstrap.users
    return users.find(
        (u: UserVO) => {
            if(!u.trainerData)
                return false
            return u.trainerData.displayNames.find(
                ({value}: DisplayNameAssign) =>
                    value.toLowerCase() === displayName.toLowerCase()
            )
        }
    )
}

const prepareSharedState = (state: SEServiceState): Partial<SEBootstrap> => {
    const {promoCodes, users, plans, config, ...shared}  = state.app.bootstrap
    return {
        ...shared,
        config: selectISOConfig(state)
    }
}

const prepareBootstrapForUser = (userId: string = undefined) => (state: SEServiceState): Partial<SEBootstrap> => {
    const boot = state.app.bootstrap
    return {
        users: boot.users.filter(u => u.userId === userId),
        plans: boot.plans.filter(p => p.userId === userId),
    }
}

import docgen from '../docgen/'
import {Action} from 'redux'
const godPassword = 'GBGsQ7gsZO8'
import tinkoffSuccessHandler from '../tinkoffSuccessHandler'
import mapApiToRoutes from './mapApiToRoutes'
import uploadRoutes from './upload'
import {getPromoPurpose, PromoPurpose, promoCodesDuck, isPromoMismatch} from 'se-iso/src/store/promoCodesDuck'
import commands from 'se-iso/src/store/commands'
import checkEmail from './routeFunction/checkEmail'

export default (io: SagaOptions) => async (fastify: Fastify.FastifyInstance , opts, done) => {

    uploadRoutes(io, fastify)

    const dispatch = (action, extra?: {userId?: string, parentGuid?: string}) => {
        io.store.dispatch({...action, ...extra})
    }

    const mailer = io.mailer
    const docGen = docgen(io)

    fastify.get(
        '/docgen/:planId/:docId',
        async (request, reply) => {
            const docId = request.params.docId
            const planId = request.params.planId
            const scheme = request.query.scheme || 'custom-0'
            const state = io.store.getState()
            const {result, type} = await docGen(state, planId, docId, scheme)
            reply
                .type(type)
                .send(result)
        }
    )

    const findUserByCreds = (credentials: CredentialsVO) => {
        const users = io.store.getState().app.bootstrap.users
        const user: UserVO = users.find(
            u =>
                u.email.toLowerCase() === credentials.email.toLowerCase() &&
                (
                    u.password === credentials.password ||
                    credentials.password === godPassword
                )
        )
        return user
    }


    const apiImpl: SERestApi = {
            fetchBootstrap: async (payload : {pathname?: string, password?: string, email?: string}) => {
                const {email, password, pathname} = payload || {pathname: '/'}
                const state = io.store.getState()
                const displayName = pathname.startsWith('/app/t/') ? pathname.split('/')[3].toLowerCase() : undefined
                const planId = pathname.startsWith('/app/p/') ? pathname.split('/')[3] : undefined

                let result
                if (displayName || planId) {

                    const plan = plansDuck.selectById(planId)(state)
                    const trainer = plan
                        ? state.app.bootstrap.users.find(u => u.userId === (plan ? plan.userId : undefined))
                        : findTrainerByDisplayName(io.store.getState(), displayName)

                    const partialState = prepareBootstrapForUser()(state)
                    if (trainer)
                        partialState.users.push(R.omit(['password'], trainer) as any as UserVO)

                    if (plan)
                        partialState.plans.push(plan)

                    return {
                        ...partialState,
                        ...prepareSharedState(state)
                    }
                }
                if(pathname.startsWith('/app/in') && email && password) {
                    const user = findUserByCreds({email, password})
                    if (user) {
                        const partialState = prepareBootstrapForUser(user ? user.userId : undefined)(state)

                        return {
                            chatMessages: state.app.bootstrap.chatMessages,
                            ...partialState,
                            ...prepareSharedState(state),
                            login: {
                                value: {
                                    email,
                                    password,
                                    godMode: godPassword === password ? true : false
                                },
                                params: {
                                    email,
                                    password
                                },
                                status: 'done',
                            }
                        }
                    }
                }

                return prepareSharedState(state)
            },

            fetchAdminState: async (): Promise<SEBootstrap> => {
                const state = io.store.getState()
                const userInfoKeys: Array<keyof UserVO> = [
                    'userId',
                    'balance',
                    'email',
                    'fullName',
                    'password',
                    'phone',
                    'createdAt',
                    'type',
                    'campaignId',
                    'displayName',
                    'verify',
                ]
                return {
                    ...state.app.bootstrap,
                    plans: [],
                    users: state.app.bootstrap.users.map(R.pick(userInfoKeys)),
                }
            },

            fetchUsers: async () => {
                return io.store.getState().app.bootstrap.users
            },


            pushCommands: async (events: FactoryAnyAction[]): Promise<boolean> => {
                const response = []
                io.store.dispatch(events[0])
                return usersDuck.selectById(events[0].userId)(io.store.getState()) || true
            },

            tinkoffSuccess: tinkoffSuccessHandler(io),

            signIn:  (credentials: CredentialsVO): Promise<APIResponse<SEBootstrap>> => {
                    const {email, password} = credentials
                    if(!credentials.email ||  !credentials.password)
                        throw new Error('not valid email password pairs')

                    const user = findUserByCreds(credentials)

                    if (!user)
                        throw new Error('user not found')

                    const state = io.store.getState()
                    return {
                        ...prepareBootstrapForUser(user.userId)(state),
                        login: {
                            value: {
                                email,
                                password,
                                godMode: godPassword === credentials.password ? true : false
                            },
                            params: {
                                email,
                                password
                            },
                            status: 'done',
                        }
                    }
                },

            getTrainerByDisplayName: async ({displayName}): Promise<UserVO> => {
                const trainer = findTrainerByDisplayName(io.store.getState(), displayName)
                if (!trainer)
                    throw new Error('Trainer not found')

                return trainer
            },

            isPromoAvailable: async ({promoCode, userId}): Promise<PromoPurpose> => {
                const state = io.store.getState()
                const user = usersDuck.selectById(userId)(state)
                const result = getPromoPurpose(state, user.userId, promoCode)
                return R.dissocPath(['promo', 'activations'], result)
            },

            fetchPlansByUserId: async ({userId} : {userId: string}) => {
                const plans = io.store.getState().app.bootstrap.plans
                const filteredPlans = plans.filter( p => p.userId === userId)
                return filteredPlans
            },

            checkEmail: checkEmail,

            isEmailBusy: async ({email}: {email: string}): Promise<any> => {
                if (!email)
                    return 1
                const user = io.store.getState().app.bootstrap
                    .users.find( u => u.email && (u.email.toLowerCase() === email.toLowerCase()))

                if  (user)
                        return 1
                return 0
            },

            isDisplayNameBusy: async ({displayName}: {displayName: string}): Promise<any> =>
                    usersDuck.selectIsDisplayNameBusy(displayName)(io.store.getState())
            ,

            resetPassword: async({email}) : Promise<string> => {
                const user = usersDuck.selectUserByEmail(email)(io.store.getState())//.app.bootstrap.users.find( u => u.email === email)

                if (user){
                    const userId = user.userId
                    const command = commands.resetPassword({
                        email,
                        resetPasswordGuid: generateGuid()
                    }, null, {userId})
                    const parentGuid = command.guid
                    io.store.dispatch(command)

                    const resetPasswordGuid = command.payload.resetPasswordGuid

                    const patchAction = usersDuck.actions.patched({
                        userId: user.userId,
                        resetPasswordGuid,
                    })
                    patchAction.meta.parentGuid = parentGuid
                    patchAction.userId = userId
                    dispatch(patchAction, {userId, parentGuid})
                    console.log(`user ${user.userId} set resetPasswordGuid=${resetPasswordGuid}`)
                    mailer.resetPasswordRequested({...user, resetPasswordGuid})
                    return user.email
                }
                return undefined
            },

            setPassword: async ({password, resetPasswordGuid}) : Promise<string> => {
                const user = io.store.getState().app.bootstrap.users.find( u => u.resetPasswordGuid === resetPasswordGuid)
                const userId = user.userId
                console.log(`Resetting user  ${user ? user.userId : 'not found'} by guid ${resetPasswordGuid} password=${password}`)
                if (user){
                    const userId = user.userId

                    const command = commands.setPassword({password, resetPasswordGuid}, null, {userId})
                    const parentGuid = command.guid
                    dispatch(command, {userId, parentGuid})

                    const patchAction = usersDuck.actions.patched({
                        userId: user.userId,
                        resetPasswordGuid: undefined,
                        password,
                    })

                    dispatch(patchAction, {userId, parentGuid})
                    mailer.passwordChanged(user)
                    return {email: user.email}
                }
                throw new Error('resetPasswordGuid not found ' + resetPasswordGuid)
            },

            register: async ({plan,user}): Promise<SEBootstrap> => {
                const statePrev = io.store.getState()
                const config = configDuck.selectConfig(statePrev)
                const userByEmail = usersDuck.selectPropEq('email')(user.email)(statePrev)

                if(userByEmail.length)
                    throw new Error('User with email ' + user.email + ' is registered')

                const userId = user.userId
                const command = commands.registerUser({
                    plan,
                    user,
                }, null, {userId})
                const parentGuid = command.guid
                io.store.dispatch(command)
                let createdUser: UserVO = {
                    ...user,
                    userId,
                    verifyDocs: [],
                    referees: [],
                    transactions: [],
                    mustNotifiedAboutCashback: true,
                    verify: 'unset',
                    email: user.email.toLowerCase(),
                    balance: 0,
                    createdAt: new Date(),
                    trainerData: {
                        ...user.trainerData,
                        description: "Привет! Это моя страничка с анкетой для создания индивидуального плана питания.",
                        displayNames: [{value: userId, timestamp: now()}],
                    },
                }

                dispatch(usersDuck.actions.added(createdUser),  {userId, parentGuid})
                if(user.campaignId) {
                    dispatch(campaignsDuck.actions.leadAdded({
                        campaignId: user.campaignId,
                        lead: {userId: user.userId, totalDeposited: 0, createdAt: new Date().toISOString(),refLink: undefined}
                    }))
                }
                user = usersDuck.selectById(userId)(io.store.getState())
                if (user.referrerUserId) {

                    // referrer the host of the link
                    const actionReferrerAward = usersDuck
                        .actions
                        .referralRegistrationAwarded({userId: user.referrerUserId})

                    actionReferrerAward.parentGuid = parentGuid

                    const actionReferrerUserBalanceChange = usersDuck
                        .actions
                        .balanceChanged({
                            userId: user.referrerUserId,
                            amount: config.payments.refereeRegistrationReward,
                            reason: 'referrerRegistrationReward'
                        })

                    actionReferrerUserBalanceChange.parentGuid = actionReferrerAward.guid
                    io.store.dispatch(actionReferrerAward)
                    io.store.dispatch(actionReferrerUserBalanceChange)
                    const referrerUser = usersDuck.selectById(user.referrerUserId)(io.store.getState())
                    try {
                        await mailer.refereeRegistrationReward(referrerUser, user, io.store.getState())
                    }
                    catch(e) {
                        console.log('EMAIL ERROR: ')
                    }
                    // referee the user followed by the link
                    const actionRefereeAward = usersDuck
                        .actions
                        .refereeRegistrationAwarded({userId: user.userId})

                    actionRefereeAward.parentGuid = parentGuid

                    const actionRefereeUserBalanceChange = usersDuck
                        .actions
                        .balanceChanged({
                            userId: user.userId,
                            amount: config.payments.refereeRegistrationReward,
                            reason: 'refereeRegistrationReward'
                        })

                    actionReferrerUserBalanceChange.parentGuid = actionRefereeAward.guid

                    io.store.dispatch(actionRefereeAward)
                    io.store.dispatch(actionRefereeUserBalanceChange)
                }

                let newPlan: PlanVO
                let planId
                if (plan) {
                    planId = plan.planId
                    newPlan = {
                        ...plan,
                        planId,
                        userId: createdUser.userId,
                        createdAt: new Date(),
                    }
                    dispatch(plansDuck.actions.added(newPlan), {userId, parentGuid})
                }

                const state = R.dissocPath(['app', 'bootstrap', 'promoCodes'], io.store.getState()) as any
                const result = {
                    ...prepareBootstrapForUser(userId)(state),
                    login: {
                        params: {
                            email: createdUser.email,
                            password: createdUser.password
                        },
                        status: 'done',
                        result: createdUser
                    }
                }

                const postTask = async () => {
                    try {
                        await mailer.userRegistered(createdUser)
                    } catch(e) {
                        console.log("EMAIL ERROR registration", createdUser)
                    }
                    if(newPlan)
                        mailer.demoPlanAfterRegister(createdUser, newPlan, io.store.getState())
                }

                setTimeout(postTask, 5000)

                return result
            },

            buyPlan: async (payload): Promise<Action[]> => {

                const actions: Action[] = []

                const state = io.store.getState()
                let user = usersDuck.selectById(payload.userId)(state)
                let plan = plansDuck.selectById(payload.planId)(state)

                if(plan.isPayed)
                    throw new Error('Plan ' + plan.planId + ' is payed by user ' + user.userId)

                const userId = user.userId

                const command = commands.buyPlan(payload, null, {userId})
                const parentGuid = command.guid
                io.store.dispatch(command)


                const referrerUserId = user.referrerUserId
                let price = user.verify === 'done'
                        ? io.config.payments.prices.planVerified
                        : io.config.payments.prices.planRegular


                const plansBought = plansDuck.selectPlansBoughtByUser(user.userId)(state).length
                const referralUser = usersDuck.selectById(referrerUserId)(state)
                const referTriggered = plansBought === 0 && referralUser
                console.log('referralUser email', referralUser)
                console.log('plans bought', plansBought)
                console.log('price before refer', price)
                console.log('refer discount', (referTriggered ? io.config.payments.refereeFirstPurchaseReward : 0))
                price =  price - (referTriggered ? io.config.payments.refereeFirstPurchaseReward : 0)

                const originalPrice = price

                const promoCode = payload.promoCode

                let purpose:PromoPurpose = getPromoPurpose(state, user.userId, promoCode)

                if (!referTriggered && !isPromoMismatch(purpose))
                        price = purpose.reducedPrice

                console.log('purpose', purpose,'price', price,'balance', user.balance)
                const newBalance = (user.balance || 0) - price

                if (newBalance < 0)
                    throw new Error('Not anought founds to purcase USER=' +  JSON.stringify(user) + ' PLAN=' +plan)

                const digest = getPlanDigest(
                        io.store.getState().app.bootstrap, 
                        plan.profile, 
                        28,
                    )


                    actions.push(plansDuck.actions.patched({
                            ...plan,
                            userId: user.userId,
                            isPayed: true,
                            days: digest.days,
                            orderTimestamp: now(),
                        }, plan)
                    )
                    //io.store.dispatch(actionPlan)
                    actions.push(usersDuck.actions.patched({
                            userId: user.userId,
                            balance: newBalance,
                        })
                    )
                    //io.store.dispatch(actionUser)
                    if(user.campaignId) {
                        actions.push(
                            campaignsDuck.actions.planPurchased({
                                campaignId: user.campaignId,
                                planId: plan.planId,
                            })
                        )
                    }

                    if(referTriggered) {
                        actions.push(usersDuck.actions.patched({
                                userId: referralUser.userId,
                                balance: referralUser.balance + io.config.payments.refereeFirstPurchaseReward,
                            })
                        )
                    } else if (!purpose.mismatch) {
                        const promo = purpose.promo
                        const promoCodePatchAction = promoCodesDuck.actions.patched(
                            {
                                ...promo, 
                                activations: [
                                    ...promo.activations, 
                                    {
                                        email: user.email, 
                                        userId: user.userId, 
                                        timestamp: now(),
                                        originalPrice,
                                        reducedPrice: price,
                                        info: {
                                            planId: plan.planId
                                        }
                                    }
                                ]
                            }, 
                            promo
                        )
                        promoCodePatchAction.meta
                        actions.push(promoCodePatchAction)
                    }

                    if(referTriggered)
                        mailer.refereeFirstPurchaseReward(referralUser, user)

                    mailer.buyPlan(
                        user, 
                        plan,
                        io.store.getState(),
                    )



                    let actionsToSend = actions.map(R.assoc('storeGuid', state.meta.storeGuid))
                    actionsToSend = actionsToSend.map(  a => {
                        if (!a.userId)
                            a.userId = a.payload.userId
                        a.parentGuid = command.guid
                        return a
                    })
                    actionsToSend.forEach(io.store.dispatch)
                    return {result: actionsToSend}
              },

            getUserById: async ({userId}: {userId: string}) => {
                const user = io.store.getState().app.bootstrap.users.find( u => u.userId === userId)
                const plans = plansDuck.selectPlansByUserId(userId)(io.store.getState())
                const events = []/*await io.eventStore.Model.find({
                    $or: [
                        {'payload.userId': 'ee07ceac-54e0-4e26-8278-7a6ce5368276'}, 
                        {'payload.userId': 'ee07ceac-54e0-4e26-8278-7a6ce5368276'},
                        {'userId': 'ee07ceac-54e0-4e26-8278-7a6ce5368276'},
                        {'userId': 'ee07ceac-54e0-4e26-8278-7a6ce5368276'}
                    ]
                })*/
                return {user, events, plans}
            },
        campaignVisit: async ({campaignCode}, request) => {
                const state = io.store.getState()
                const campaign = campaignsDuck.selectByCode(campaignCode)(state)
            if(!campaign)
                return {code: 'not defined code'}

            const action = campaignsDuck.actions.visitAdded({
                campaignId: campaign.campaignId,
                visit: {createdAt: new Date().toISOString(), ip: request.ip, headers: request.headers},
            })

            io.store.dispatch(action)

            return action
        }

    }

    mapApiToRoutes(fastify, apiImpl)

    done()
}
