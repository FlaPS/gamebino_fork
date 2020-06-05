import {put, fork, take, call, actionChannel, takeEvery, select} from 'redux-saga/effects'
import {api} from 'se-iso'
import React from 'react'
import {SEClientCofnig} from '../globals'
import {asyncWorker} from 'se-iso/src/utils/asyncWorker'
import {usersDuck, actions, UserVO} from 'se-iso/src/store/usersDuck'
import {FactoryAnyAction, isNamespace} from '../../../fsa/src'
import {
    campaignsDuck, CampaignVO, chatMessagesDuck,
    configDuck,
    connectionDuck,
    connectionSaga,
    ingredientsDuck,
    metaDuck,
    recipesDuck,
} from 'se-iso/src'
import {plansDuck} from 'se-iso/src/store/plansDuck'
import {quizDuck} from 'se-iso/src/store/quizDuck'
import { promoCodesDuck } from 'se-iso/src/store/promoCodesDuck'
import {uiDuck} from '../../../se-mobile-front/src/store/uiDuck'
import {notification} from 'antd'
import * as R from 'ramda'
import rjvTheme from '../rjvTheme'
import {generateGuid} from '@sha/random'
import {WSFront} from 'se-iso/src/store/connection/WSFront'
import {StoreMeta} from 'se-iso/src/store/metaDuck'
import JSONTree from '../JSONTree'
import localAdminPreferencesDuck from 'se-iso/src/store/localAdminPreferencesDuck'
import {adminNotifySaga} from './adminOverlayNotifySaga'
import {sessionsDuck} from 'se-iso/src/store/sessionsDuck'

export function* seAdminSaga(config: SEClientCofnig) {

    yield fork(localAdminPreferencesDuck.adminPreferencesSaga)
    yield fork(adminNotifySaga)
    yield put(metaDuck.actions.metaUpdated({userId: 'admin'}))

    const meta: StoreMeta = yield select(metaDuck.selectMeta)
    yield fork(connectionSaga)
    yield put(connectionDuck.actions.gatewayChanged(WSFront.getWSSRoute(meta)))
    yield take(connectionDuck.actions.connected.isType)
    yield put(uiDuck.actions.busy('fetchAdminState'))



    // configure api
    const endpoint = api(yield select())

    const result = (yield call(endpoint.fetchAdminState, {})).result
    yield put(
        configDuck.actions.configUpdated(result.config)
    )

    const users: UserVO[]  = result.users
    yield put(
        usersDuck.actions.reseted(result.users)
    )
    yield put(
        ingredientsDuck.actions.reseted(result.ingredients)
    )
    yield put(
        recipesDuck.actions.reseted(result.recipes)
    )
    yield put(
        plansDuck.actions.reseted(result.plans)
    )
    yield put(
        quizDuck.actions.reseted(result.quiz)
    )
    yield put(
        promoCodesDuck.actions.reseted(result.promoCodes)
    )

    yield put(
        sessionsDuck.actions.reseted(result.sessions)
    )
    yield put(
        chatMessagesDuck.actions.reseted(result.chatMessages)
    )

    const usersByIds = {}
    for(let i = 0 ; i < users.length; i++) {
        const user = users[i]
        usersByIds[user.userId] = user
    }
    const campaigns: CampaignVO[] = result.campaigns
    yield put(
        campaignsDuck.actions.reseted(campaigns.map( c => ({
            ...c,
            personalUsers: c.leads.reduce(
                (previousValue, currentValue) =>
                    usersByIds[currentValue.userId].type === 'personal'
                        ? previousValue+1
                        : previousValue
            , 0)
        })))
    )

    yield put(uiDuck.actions.unbusy('fetchAdminState'))

}



