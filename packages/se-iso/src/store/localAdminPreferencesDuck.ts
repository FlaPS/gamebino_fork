import * as FSA from '@sha/fsa'
import {SEISOState} from '../SEISOState'
import appStorage from '../appStorage'
import {takeLatest,select} from 'redux-saga/effects'
import {mergeDeepRight} from 'ramda'
import mergeDeep from '../../../utils/mergeDeep'

const appStorageItemId = 'localAdminPreferences'

const defaultAdminPreferences = {
    liveEventFeedOverlay: true,
}

export type AdminPreferences = typeof defaultAdminPreferences

const factory = FSA.actionCreatorFactory('preferences')

const actions = {
    updated: factory<AdminPreferences>('updated')
}

const reducer = FSA.reducerWithInitialState(
    appStorage.getItem(appStorageItemId, defaultAdminPreferences) as AdminPreferences
).case(actions.updated, (state, payload) =>
    {
        const r = mergeDeep<AdminPreferences>(state)(payload)
        return r as any as AdminPreferences
    }
)

const selectPreferences = (state: SEISOState): AdminPreferences =>
    state.adminPreferences

function* adminPreferencesSaga() {
    yield takeLatest(actions.updated.isType, function* (action) {
        const state = yield select(selectPreferences)
        appStorage.setItem('localAdminPreferences', state)
    })
}

export default {
    adminPreferencesSaga,
    actions,
    factory,
    reducer,
   selectPreferences
}