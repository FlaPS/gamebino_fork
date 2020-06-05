import { Action, applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { isBrowser } from '@sha/utils'
import adminReducer, {SEAdminState} from './adminReducer'

import { routerMiddleware, getBrowserHistory } from '@sha/router'


const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION__'

const configureAdminStore = (
  initialState?: SEAdminState,
  historyInstance: ReturnType<typeof getBrowserHistory> = getBrowserHistory()
) => {

  // @ts-ignore
  const store = createStore(adminReducer(historyInstance), initialState, getFrontEndMiddleware(historyInstance))

  store['runSaga'] = sagaMiddleware.run
  const dispatch = store.dispatch
  let prevRoute = '?'

  // @ts-ignore
  store['dispatch'] = (action: FactoryAnyAction) => {
    if (!action) return

    if (action && action.type === '@@router/LOCATION_CHANGE')  {
      if ( prevRoute !== action.payload.location.pathname) {
        prevRoute = action.payload.location.pathname
        dispatch(action)
      }
    } else {
      dispatch(action)
    }
  }
  singletonFrontendStore = store
  return store as typeof store & { runSaga: Function, history: any }
}

export let singletonFrontendStore

const sagaMiddleware = createSagaMiddleware()

const getFrontEndMiddleware = (history: any) =>
  isBrowser() && window[REDUX_DEV_TOOLS]
    ?
    compose(
      applyMiddleware(routerMiddleware(history), sagaMiddleware),
      window[REDUX_DEV_TOOLS]({trace: true, traceLimit: 25 }),
    )
    :
    compose(
      applyMiddleware(routerMiddleware(history), sagaMiddleware),
    )

export default configureAdminStore
