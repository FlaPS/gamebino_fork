import {SEClientCofnig} from '../globals'
import {History} from 'history'
import {call, fork, put, select, take} from 'redux-saga/effects'
import {api, bootstrapDuck, chatMessagesDuck, connectionDuck, metaDuck} from 'se-iso/src'
import {asyncWorker} from './asyncWorker'

import {nav} from '../nav'
import * as router from '@sha/router'
import {plansDuck} from 'se-iso/src/store/plansDuck'
import {usersDuck} from 'se-iso/src/store/usersDuck'

import appStorage from 'se-iso/src/appStorage'
import {loginDuck, SignInDonePayload} from '../store/loginDuck'
import LogRocket from 'logrocket'
import {selectCurrentUser} from '../store/clientReducer'
import {WSFront} from 'se-iso/src/store/connection/WSFront'

export function* loginSaga(config: SEClientCofnig) {

    // configure api
    const endpoint = api(yield select())

    let meta = yield select(metaDuck.selectMeta)

    let query = new URLSearchParams(meta)
    yield put(connectionDuck.actions.gatewayChanged(WSFront.getWSSRoute(meta)))

    while(true) {

        const action = yield take(loginDuck.actions.signIn.done.isType)
        const result: SignInDonePayload = action.payload.result
        if(action.payload.params.remember)
            appStorage.setItem('credentials', action.payload.params)
        // console.log('fetching plans for', action.payload.result.userId)
        // yield put(usersDuck.actions.reseted([action.payload.result]))
        // const plans = yield call(endpoint.mobile.fetchPlansByUserId, {userId: action.payload.result.userId})

        //yield put(plansDuck.actions.reseted(plans))
        if(result.users)
            yield put(usersDuck.actions.reseted(result.users))

        if(result.plans)
            yield put(plansDuck.actions.reseted(result.plans))

        if(result.chatMessages)
            yield put(chatMessagesDuck.actions.reseted(result.chatMessages))

        const state = yield select()
        const route = state.router.location.pathname

        if (!route.includes('/app/in/'))
            yield put(router.replace(nav.regime)())
        console.log('loginSaga result applying signInDone', result)
        if(result.users) {
            console.log('identify logrocket user as', result.users[0])
            LogRocket.identify(result.users[0].email, result.users[0])
        } else {
            console.log('Error USer not found in local state', result)
        }

        let user = yield select(selectCurrentUser)
        yield put(metaDuck.actions.metaUpdated({userId: user.userId}))
        meta = yield select(metaDuck.selectMeta)

        let query = new URLSearchParams(meta)
        yield put(connectionDuck.actions.gatewayChanged(WSFront.getWSSRoute(meta)))
        yield take(loginDuck.actions.signIn.unset.isType)

        yield put(metaDuck.actions.metaUpdated({userId: 'guest'}))
        meta = yield select(metaDuck.selectMeta)

        query = new URLSearchParams(meta)
        yield put(connectionDuck.actions.gatewayChanged(WSFront.getWSSRoute(meta)))
        yield put(router.replace(nav.signIn)())
        appStorage.setItem('credentials', undefined)
    }
}

function* autoLogin() {

}