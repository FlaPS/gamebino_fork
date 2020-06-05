import * as FSA from '@sha/fsa'
import {CredentialsVO} from 'se-iso/src/api'
import {UserVO} from 'se-iso/src/store/usersDuck'
import {PlanVO} from 'se-iso/src'
import {SEClientState} from './clientReducer'
import {oc} from 'ts-optchain'
const factory = FSA.actionCreatorFactory('login')

export type SignInDonePayload =  {
    users: UserVO[],
    plans: PlanVO[],
    login: {
        value,
        params,
        status,
    }
}

const actions = {
    signIn: factory.async<CredentialsVO, SignInDonePayload>('signIn'),
    registered: factory.async<CredentialsVO & Partial<UserVO>, UserVO & {godMode?: boolean}>('register'),
    addBalance:  factory.async<CredentialsVO & {amount: number}>('addBalance'),
    buyPlan: factory.async<CredentialsVO & {planId: string}>('buyPlan'),
}

const reducer = actions.signIn.asyncReducer

export const selectIsGodMod = (state: SEClientState) => {
    const val = oc(state).app.login.value.login.value.godMode(false)
    return val
}

export const loginDuck = {
    actions,
    factory,
    reducer,
}