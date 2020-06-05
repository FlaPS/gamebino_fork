import {SagaOptions} from './SagaOptions'
import {call, put} from 'redux-saga/effects'
import {campaignsDuck, chatMessagesDuck, configDuck, ingredientsDuck, plansDuck, recipesDuck} from 'se-iso/src'
import getBootstrapXSL from '../getBootstrap'
import {quizDuck} from 'se-iso/src/store/quizDuck'
import {defaultPromoVO, promoCodesDuck} from 'se-iso/src/store/promoCodesDuck'
import * as R from 'ramda'
import {usersDuck} from 'se-iso/src/store/usersDuck'

export function* bootstrapSaga(io: SagaOptions) {
    yield put(configDuck.actions.configUpdated(io.config))
    const { PromosRepo, PlansRepo,UsersRepo, CampaignsRepo } = io

    const directory = yield call(getBootstrapXSL)
    yield put(
        ingredientsDuck.actions.reseted(directory.ingredients)
    )
    yield put(
        recipesDuck.actions.reseted(directory.recipes)
    )
    yield put(
        quizDuck.actions.reseted(directory.quiz)
    )


    const plans = yield call(PlansRepo.getAll)
    const users = yield call(UsersRepo.getAll)
    let promos = yield call(PromosRepo.getAll)
    let campaigns = yield call(CampaignsRepo.getAll)


    const omitId = R.omit(['_id'])

    yield put(
        plansDuck.actions.reseted(plans.map(omitId))
    )

    yield put(
        usersDuck.actions.reseted(users.map(omitId))
    )

    yield put(
        campaignsDuck.actions.reseted(campaigns.map(omitId))
    )
    yield put(
        chatMessagesDuck.actions.reseted([])
    )
    yield put(
        promoCodesDuck.actions.reseted(promos.map(omitId))
    )

}