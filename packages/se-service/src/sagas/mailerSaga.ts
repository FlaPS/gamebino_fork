import {SagaOptions} from './SagaOptions'
import {actionChannel, call, take,takeEvery} from 'redux-saga/effects'
import {usersDuck} from 'se-iso/src/store/usersDuck'

export function* mailerSaga(io: SagaOptions) {
    const mailer = io.mailer

    const selectUser = (id) =>
        io.store.getState().app.bootstrap.users.find(user => user.userId === id)

    yield takeEvery(usersDuck.actions.verify.started.isType, function* (action) {
       yield call(mailer.verifyRequested, selectUser(action.payload.userId))
    })

    yield takeEvery(usersDuck.actions.verify.done.isType, function* (action) {
        yield call(mailer.verifySuccess, selectUser(action.payload.params.userId))
    })

    yield takeEvery(usersDuck.actions.verify.failed.isType, function* (action) {
        yield call(mailer.verifyFailed, selectUser(action.payload.params.userId))
    })

}

