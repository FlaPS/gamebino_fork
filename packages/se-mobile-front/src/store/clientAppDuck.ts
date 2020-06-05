import {combineReducers} from 'redux'
import {uiDuck} from './uiDuck'
import {bootstrapDuck, connectionDuck, SEBootstrap} from 'se-iso/src/store'
import {loginDuck} from './loginDuck'
import {trainersQuizDuck} from './trainersQuizDuck'

const combined = combineReducers({
    ui: uiDuck.reducer,
    bootstrap: bootstrapDuck.reducer,
    login: loginDuck.reducer,
    conn: connectionDuck.reducer,
})

export const selectBootstrap = (state: {app: {bootstrap: SEBootstrap}}) => state.app.bootstrap

export type ClientAppState = ReturnType<typeof combined>

export const clientAppDuck = {
    reducer: combined,
}