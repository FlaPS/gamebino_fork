import { combineReducers } from 'redux'
import { connectRouter, RouterState, getBrowserHistory } from '@sha/router'
import { History } from 'history'
import { prepend, slice } from 'ramda'
import {AsyncState, FactoryAnyAction} from '@sha/fsa'
import {adminDuck} from './adminDuck'
import {metaDuck, SEBootstrap} from 'se-iso/src'
import {StoreMeta} from 'se-iso/src/store/metaDuck'
import {UIState} from '../../../se-mobile-front/src/store/uiDuck'
import {ConnectionState} from 'se-iso/src/store/connection/connectionDuck'
import localAdminPreferencesDuck, {AdminPreferences} from 'se-iso/src/store/localAdminPreferencesDuck'

export type DeepReadonly<T> = T extends any[]
  ? DeepReadonlyArray<T[number]>
  : T extends object ? DeepReadonlyObject<T> : T

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}

export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

const adminReducer = (history: History = getBrowserHistory()) => {
  const restStateReducer = combineReducers({
      router: connectRouter(history),
      app: adminDuck.reducer,
      meta: metaDuck.reducer,
      adminPreferences: localAdminPreferencesDuck.reducer
    },

  )

  const prevStateReducer = (state: SEAdminState = {} as SEAdminState, action: FactoryAnyAction): SEAdminState => {

    let prevStates = state.prevStates || []
    const restState = restStateReducer(state, action)
    return {...restState, prevStates}
  }

  return prevStateReducer
}


export type SEAdminAppState = {
  ui: UIState,
  conn: ConnectionState,
  bootstrap: SEBootstrap,
  adminPreferences: AdminPreferences
}

type AllAdminState = {
  router: RouterState,
  app: SEAdminAppState,
  meta: StoreMeta,
}

export type SEAdminState = AllAdminState & {
  prevStates: AllAdminState[]
}

export default adminReducer
