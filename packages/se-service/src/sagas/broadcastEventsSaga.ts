import {actionChannel, call, take} from 'redux-saga/effects'


import WSBack from '../io/WSBack'
import {isPersistentAction} from 'se-iso/src'
import {sessionsDuck} from 'se-iso/src/store/sessionsDuck'
import {isNamespace} from '@sha/fsa'

export function* broadcastEventsSaga() {
    const adminAction = yield actionChannel( (action: any) => {
        if(isPersistentAction(action) || isNamespace(sessionsDuck.factory)(action))
            return true

        return false
    })

    while(true) {
        const action = yield take(adminAction)
        action.source = 'admin'

        yield call(WSBack.broadcastAction, action)
    }
}