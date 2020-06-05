import * as fsa from '@sha/fsa'
import {TinkoffSuccessIncomingRequest, UserVO} from './usersDuck'
import {PlanVO} from '../getPlanDigest'


const factory = fsa.actionCreatorFactory('command', {persistent: true})


export const commands = {
    setPassword: factory<{password: string, resetPasswordGuid: string}>('setPassword'),
    resetPassword: factory<{email: string, resetPasswordGuid: string}>('resetPassword'),
    buyPlan: factory<{promoCode: string, userId: string, planId: string}>('buyPlan'),
    registerUser: factory<{plan: PlanVO, user: UserVO}>('registerUser'),
    applyProfile: factory<{}>('applyProfile'),
    tinkoffDeposit: factory<TinkoffSuccessIncomingRequest>('tinkoffDeposit'),

}

export default commands

