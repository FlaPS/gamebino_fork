import { combineReducers } from 'redux'
import { connectRouter, RouterState, getBrowserHistory } from '@sha/router'
import { History } from 'history'
import {clientAppDuck, ClientAppState} from './clientAppDuck'
import {metaDuck} from 'se-iso/src'

export type DeepReadonly<T> = T extends any[]
    ? DeepReadonlyArray<T[number]>
    : T extends object ? DeepReadonlyObject<T> : T

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}

export type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>
}

const clientReducer = (history: History = getBrowserHistory()) => {
    const restStateReducer = combineReducers({
            router: connectRouter(history),
            app: clientAppDuck.reducer,
            meta: metaDuck.reducer,
        },

    )
/*
    const prevStateReducer = (state: SEClientState = {} as SEClientState, action: FactoryAnyAction): SEClientState => {

        let prevStates = state.prevStates || []
        const restState = restStateReducer(state, action)
        return {...restState, prevStates}
    }
*/
    return restStateReducer
}


type AllClientState = {
    router: RouterState,
    app: ClientAppState
}

export type SEClientState = AllClientState

export const selectCurrentUser = (state: SEClientState) =>
    state.app.bootstrap.users[0]

export const selectCurrentUserPage = (state: SEClientState) =>
    state.app.bootstrap.config.externalFrontendHost + '/app/t/' + selectCurrentUser(state).trainerData.displayNames[0].value

export const selectPlanById = (planId: string) =>
    (state: SEClientState) =>
        state.app.bootstrap.plans.find( plan => plan.planId === planId)

export default clientReducer
