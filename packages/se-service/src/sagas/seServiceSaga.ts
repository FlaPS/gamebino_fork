import {SagaOptions} from './SagaOptions'
import {actionChannel, call, put, select, take, fork, takeEvery} from 'redux-saga/effects'
import getBootstrapXLS from '../getBootstrap/'
import buildRestRoutes from '../restServer/routes'
import {campaignsDuck, ingredientsDuck, recipesDuck, SEBootstrap} from '../../../se-iso/src/store'
import {usersDuck, UserVO} from 'se-iso/src/store/usersDuck'
import {configDuck, PlanVO, getPlanDigest} from 'se-iso/src'
import {plansDuck} from 'se-iso/src/store/plansDuck'
import {generateGuid} from '@sha/random'
import {quizDuck} from 'se-iso/src/store/quizDuck'
import {defaultPromoVO, promoCodesDuck, PromoVO} from 'se-iso/src/store/promoCodesDuck'
import RestServer from '../restServer/'
import * as R from 'ramda'
import { broadcastEventsSaga} from './broadcastEventsSaga'
import {mailerSaga} from './mailerSaga'
import getBootstrapXSL from '../getBootstrap'
import {bootstrapSaga} from './bootstrapSaga'
import {isNamespace} from '@sha/fsa'
import {updateConfig} from '../SEServiceConfig'
import {notifyCashbackSaga} from './cashbackNotifySaga'

export function* seServiceSaga(io: SagaOptions) {
    yield* bootstrapSaga(io)
    const { PromosRepo, PlansRepo,UsersRepo, CampaignsRepo } = io
    console.log('Bootstraped')

    const mailer = io.mailer
    yield takeEvery(plansDuck.actions.profileFilled.isType, function* (action) {
        const digest = getPlanDigest(io.store.getState().app.bootstrap, action.payload.profile, 1)
        const newPlanAction = plansDuck.actions.added({
            userId: action.payload.userId,
            planId: action.payload.planId,
            profile: action.payload.profile,
            days: digest.days,
            isExternal: true,
            createdAt: new Date().toISOString(),
        }, {persistent: true})
        const act = {...newPlanAction, userId: action.payload.userId, parentGuid: action.guid}
        yield put(act)

        yield call(
            mailer.newClientForTrainerHandler,
            yield select(usersDuck.selectById(newPlanAction.payload.userId)),
            yield select(plansDuck.selectById(newPlanAction.payload.planId)),
        )

    })
    yield fork(mailerSaga, io)
    yield takeEvery('*', function* (action) {
        try {
            if(configDuck.actions.configUpdated.isType(action)) {
                yield call(updateConfig, "mongodb://localhost:27017", "smart-eat", action.payload)
            }
            if (plansDuck.actions.added.isType(action)) {
                yield call(PlansRepo.create, action.payload)
            }
            if (plansDuck.actions.removed.isType(action)) {
                yield call(PlansRepo.removeById, action.payload)
            }
            if (plansDuck.actions.updated.isType(action) || plansDuck.actions.patched.isType(action)) {
                const plan: PlanVO = yield select(plansDuck.selectById(action.payload.planId))
                yield call(PlansRepo.updateById, plan)
            }

            if (campaignsDuck.actions.added.isType(action)) {
                yield call(CampaignsRepo.create, action.payload)
            }
            else if (campaignsDuck.actions.removed.isType(action)) {
                yield call(CampaignsRepo.removeById, action.payload)
            }
            else if (isNamespace(campaignsDuck.factory)(action)) {
                const id = action.payload.campaignId
                if(id) {
                    const campaign: PlanVO = yield select(campaignsDuck.selectById(action.payload.campaignId))
                    yield call(CampaignsRepo.updateById, campaign)
                }
            }


            if (usersDuck.actions.added.isType(action)) {
                yield call(UsersRepo.create, action.payload)
            }
            if (usersDuck.actions.removed.isType(action)) {
                yield call(UsersRepo.removeById, action.payload)
            }
            if (promoCodesDuck.actions.added.isType(action)) {
                yield call(PromosRepo.create, action.payload)
            }

            else if(usersDuck.actions.verify.started.isType(action)) {
                const user: UserVO = yield select(usersDuck.selectById(action.payload.userId))
                yield call(UsersRepo.updateById, user)
            }

            else if(usersDuck.actions.verify.done.isType(action) ||  usersDuck.actions.verify.failed.isType(action) ) {
                const user: UserVO = yield select(usersDuck.selectById(action.payload.params.userId))
                yield call(UsersRepo.updateById, user)
            }

            else if (
                isNamespace(usersDuck.factory)(action)
            ) {
                const userId = action.payload.userId || action.userId
                if(userId) {
                    const user: UserVO = yield select(usersDuck.selectById(userId))
                    yield call(UsersRepo.updateById, user)
                }
            }

            if (promoCodesDuck.actions.updated.isType(action) || promoCodesDuck.actions.patched.isType(action)) {
                const promo: PromoVO = yield select(promoCodesDuck.selectById(action.payload.promoId))
                yield call(PromosRepo.updateById, promo)
            }
           
        }catch(e) {
            console.log('Error save event', action, e, e.stack)
        }
    })

    yield fork(notifyCashbackSaga, io)
    const fastify = yield call(RestServer, io)
}
