import {sleep} from '@sha/utils'
import {actionChannel, call, take,takeEvery, put, select} from 'redux-saga/effects'
import {SEServiceState} from '../store/serviceDuck'
import {SagaOptions} from './SagaOptions'
import {usersDuck} from 'se-iso/src/store/usersDuck'


export function* notifyCashbackSaga(io: SagaOptions) {
    while (true) {
        yield call(sleep, 10000)
        const state: SEServiceState = yield select()
        const config = state.app.bootstrap.config
        const currentDate = (
            new Date(
                new Date().getTime() - config.notifications.cashbackMailTimeout * 1000
            )
        ).toISOString()

        const users = state.app.bootstrap.users

        const usersToNotify = users.filter( u => u.mustNotifiedAboutCashback)
        const usersToNotifyNow = usersToNotify.filter(u =>
            new Date(u.createdAt).toISOString() <= currentDate
        )
        for(let i = 0; i < usersToNotifyNow.length; i ++) {
            const user = usersToNotifyNow[i]
            io.mailer.cashbackNotify(user.userId, state)
            const action = usersDuck.actions.patched({userId:user.userId, mustNotifiedAboutCashback: false})
            yield put(action)
        }
    }
}

