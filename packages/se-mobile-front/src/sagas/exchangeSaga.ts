import {actionChannel, call, take, select} from 'redux-saga/effects'
import {SEClientCofnig} from '../globals'
import {api, isPersistentAction} from 'se-iso/src'
import {FactoryAnyAction, isNamespace} from '../../../fsa/src'
import {usersDuck, UserVO} from 'se-iso/src/store/usersDuck'
import {plansDuck} from 'se-iso/src/store/plansDuck'
import {selectCurrentUser} from '../store/clientReducer'
import * as R from 'ramda'




export function* exchangeSaga(config: SEClientCofnig, storeGuid: string) {

    // configure api

    const channel = yield actionChannel(isPersistentAction)

    while(true) {
        const action = yield take(channel)

        if(action.external)
            continue

        const user: UserVO = yield select(selectCurrentUser)
        const endpoint = api(yield select())

        if(user) {
            action.source = 'user-'+user.userId
            if (!action.userId)
            action.userId = user.userId
        }
        else {
            action.source = 'guest'
            if (!action.userId)
                action.userId = 'guest'
        }



        const meta = yield select(state => state.meta)
        if(!action.storeGuid) {
            let actionToSend = {...action}
            actionToSend = R.assocPath(['storeGuid'], storeGuid, action)
            console.log('sending action', actionToSend)
            yield call(endpoint.pushCommands, [actionToSend])
        }
    }
}