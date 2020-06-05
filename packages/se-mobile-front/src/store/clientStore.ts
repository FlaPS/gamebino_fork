import { Action, applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { isBrowser } from '@sha/utils'

import { routerMiddleware, getBrowserHistory } from '@sha/router'
import { FactoryAnyAction } from '@sha/fsa'
import clientReducer, {SEClientState} from './clientReducer'
import LogRocket from 'logrocket'
import {generateGuid} from '@sha/random'
import {WSFront} from 'se-iso/src/store/connection/WSFront'


const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION__'
const appliedGuids = []
export const configureClientStore = (
    initialState?: SEClientState,
    historyInstance: ReturnType<typeof getBrowserHistory> = getBrowserHistory()
) => {

    // @ts-ignore
    const store = createStore(clientReducer(historyInstance), initialState, getFrontEndMiddleware(historyInstance))


    store['runSaga'] = sagaMiddleware.run
    const dispatch = store.dispatch
    let prevRoute = '?'


    const applyEvent = action => {
        if (!action.guid)
            action.guid = generateGuid()

        //if(!appliedGuids.includes(action.guid)) {
            dispatch(action)
          //  appliedGuids.push(action.guid)
        //}

    }

    const appliedGuids = []
    // @ts-ignore
    store['dispatch'] = (action: FactoryAnyAction) => {
        if (!action) return
        if(appliedGuids.includes(action.guid))
            return
        if(action.guid)
            appliedGuids.push(action.guid)

        if(!action.userId) {
            if(action.payload && action.payload.userId)
                action.userId = action.payload.userId
        }
        if (action && action.type === '@@router/LOCATION_CHANGE')  {
            if ( prevRoute !== action.payload.location.pathname) {
                prevRoute = action.payload.location.pathname
                applyEvent(action)
            }
        } else {
            applyEvent(action)
        }
    }
    singletonFrontendStore = store
    window.addEventListener('bootstrapEvent' , (e: CustomEvent) =>
        store.dispatch(e.detail)
    )
    return store as typeof store & { runSaga: Function, history: any }
}

export let singletonFrontendStore

const sagaMiddleware = createSagaMiddleware()

const getFrontEndMiddleware = (history: any) =>
    isBrowser() && window[REDUX_DEV_TOOLS]
        ?
        compose(
            applyMiddleware(routerMiddleware(history), sagaMiddleware, LogRocket.reduxMiddleware()),
            window[REDUX_DEV_TOOLS](),
        )
        :
        compose(
            applyMiddleware(routerMiddleware(history), sagaMiddleware, LogRocket.reduxMiddleware()),
        )

export default configureClientStore
