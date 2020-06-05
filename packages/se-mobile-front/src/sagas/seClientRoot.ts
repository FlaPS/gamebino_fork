import {put, fork, take, select, call, race, takeLatest, takeEvery} from 'redux-saga/effects'
import {api} from 'se-iso'
import {SEClientCofnig} from '../globals'
import {asyncWorker} from './asyncWorker'
import {dispatchOnRouteSaga, isAnyLocationAction, isLocationAction, LocationAction, nav, takeLatestRoute} from '../nav'
import * as router from '@sha/router'
import {
    bootstrapDuck, chatMessagesDuck,
    configDuck,
    connectionSaga,
    ingredientsDuck,
    metaDuck,
    recipesDuck,
    SEBootstrap,
} from 'se-iso/src'
import {loginSaga} from './loginSaga'
import {exchangeSaga} from './exchangeSaga'
import {plansDuck} from 'se-iso/src/store/plansDuck'
import {RegisterRequestPayload, usersDuck} from 'se-iso/src/store/usersDuck'
import {APIResponse} from 'se-iso/src/utils/asyncWorker'

import appStorage from 'se-iso/src/appStorage'
import {quizDuck} from 'se-iso/src/store/quizDuck'
import {uiDuck} from '../store/uiDuck'
import {SEClientState} from '../store/clientReducer'
import {trainersQuizDuck} from '../store/trainersQuizDuck'
import {loginDuck} from '../store/loginDuck'
import LogRocket from 'logrocket'
import {generateGuid} from '@sha/random'

export function* seClientRoot(config: SEClientCofnig) {
    yield fork(connectionSaga, false)
    yield put(metaDuck.actions.metaUpdated({userId: 'guest'}))

    yield fork(loginSaga, config)


    yield put(uiDuck.actions.busy('initialize'))
    // configure api
    const endpoint = api(yield select())

    yield take('@@router/LOCATION_CHANGE')
    let state: SEClientState = yield select()

    const route = state.router.location.pathname


    let bootstrapAction: ReturnType<typeof bootstrapDuck.actions.fetchBootstrap.done> = window['bootstrapEvent']

    if (bootstrapAction) {
        yield put(bootstrapAction)
    }
    else {

        bootstrapAction = yield take(bootstrapDuck.actions.fetchBootstrap.done.isType)
    }

    const result = bootstrapAction.payload.result
    yield put(ingredientsDuck.actions.reseted(result.ingredients))
    yield put(quizDuck.actions.reseted(result.quiz))
    yield put(recipesDuck.actions.reseted(result.recipes))
    yield put(plansDuck.actions.reseted(result.plans || []))
    yield put(usersDuck.actions.reseted(result.users || []))
    yield put(configDuck.actions.configUpdated(result.config || []))
    yield put(chatMessagesDuck.actions.reseted(result.chatMessages || []))
    const loginState = bootstrapAction.payload.result
    if(loginState.login)  {
        yield put(loginDuck.actions.signIn.done({result: loginState, params: loginState.login.params}))
    }

   // if (!route.startsWith('/app/guest/') && !route.startsWith('/app/t/') && !route.startsWith('/app/p/'))

    state = yield select()
    if (route === '/app/'){
        yield put(router.push(nav.signIn)())

    } else if(route.startsWith('/app/t/')){
            if(state.app.bootstrap.users.length === 0)
                yield put(router.push(nav.unknownTrainer)())
    } else if(route.startsWith('/app/guest')) {

    } else if(route.startsWith('/app/p/')) {
        if(state.app.bootstrap.plans.length === 0)
            yield put(router.push(nav.unknownTrainer)())

    }
    else if(route.startsWith('/app/in')){
        if(state.app.login.status === 'done') {

                if (route === '/app/in/pay/done' || route === '/app/in/pay/failed') {
                    const planToById = appStorage.getItem('planToById')
                    if (planToById) {
                        yield put(router.replace(nav.buyPlan)({planId: planToById}))
                    }
                    else
                        yield put(router.replace(nav.regime)())

                    if (route === nav.tinkoffDone()) {
                        yield put(uiDuck.actions.showPopUp(uiDuck.modalTypes.PutMoneySuccessModal))
                    }
                    else if (route === nav.tinkoffFailed()) {
                        yield put(uiDuck.actions.showPopUp(uiDuck.modalTypes.PutMoneyFailedModal))
                    }
                    //yield put(router.replace(nav.regime)())
                } else {
                    appStorage.setItem('planToById', undefined)
                }
        }
        else
            yield put(router.replace(nav.signIn)())



    }
    yield put(uiDuck.actions.unbusy('initialize'))



    yield fork(registerSaga, config)
    yield fork(savePlanIdToBuy)

    const storeGuid = generateGuid()
        //yield fork(connectionSaga, undefined, storeGuid, config, false)


    yield takeEvery(loginDuck.actions.signIn.done.isType, function* () {
        let state: SEClientState = yield select()
        console.log('identify logrocket user as', state.app.bootstrap.users[0])
        LogRocket.identify(state.app.bootstrap.users[0].email, state.app.bootstrap.users[0])
    })
}

function* savePlanIdToBuy() {
    yield takeLatest(
        loginDuck.actions.signIn.done.isType,
        function* (a: ReturnType<typeof loginDuck.actions.signIn.done> ) {
            const state: SEClientState = yield select()
            const u = state.app.bootstrap.users[0]
            appStorage.setItem('planToById', undefined)
/*
            LogRocket.identify(u.userId, {
                name: u.fullName,
                email: u.email,

                // Add your own custom user variables here, ie:
                type: u.type,
                phone: u.phone
            });
            */

        }
    )

    yield takeLatest(loginDuck.actions.signIn.unset.isType,
        function* (a: ReturnType<typeof loginDuck.actions.signIn.unset> ) {
            yield put(router.push(nav.signIn)())
        }
    )

    yield  takeLatestRoute(
            nav.buyPlan,
            function* (p) {
                appStorage.setItem('planToById',p.planId)
            }
        )
    yield takeLatest(
            isAnyLocationAction,
            function* (p: LocationAction) {
                const route = p.payload.location.pathname
                const state: SEClientState = yield select()

                if(window.location.origin === state.app.bootstrap.config.externalFrontendHost) {
                    if (!route.startsWith('/app/p/') || !route.startsWith('/app/t/') )
                        window.location.pathname = '/'
                    return
                }
                if(!route.startsWith('/app/in/buyPlan/'))
                    appStorage.setItem('planToById', undefined)
            }
        )
}

function* registerSaga(config: SEClientCofnig) {
    const endpoint = api(yield select())
    yield takeLatest(usersDuck.actions.registered.started.isType, function* (action){
        const registerPayload:RegisterRequestPayload = action.payload
        yield put(uiDuck.actions.busy('register'))
        const result: APIResponse<SEBootstrap> = yield call(endpoint.register, registerPayload)
        yield put(usersDuck.actions.reseted(result.result.users))
        yield put(plansDuck.actions.reseted(result.result.plans))

        yield put(loginDuck.actions.signIn.done({
            result: result.result,
            params: registerPayload,
        }))
        const password = registerPayload.user.password
        const email = registerPayload.user.email
        appStorage.setItem('credentials',{remember: true, password, email})
        if(!registerPayload.plan)
            yield put(router.replace(nav.regime)())
        else
            yield put(router.replace(nav.demoMyClientPlanNoBack)({planId: registerPayload.plan.planId}))
        yield put(uiDuck.actions.unbusy('register'))
        console.log('Registered', result)
    })
}



