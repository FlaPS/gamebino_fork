import {takeEvery, select} from 'redux-saga/effects'
import {connectionDuck} from 'se-iso/src'
import {FactoryAction, FactoryAnyAction} from '../../../fsa/src'
import {notification} from 'antd'
import React from 'react'
import JSONTree from '../JSONTree'
import localAdminPreferencesDuck, {AdminPreferences} from 'se-iso/src/store/localAdminPreferencesDuck'

export function* adminNotifySaga() {
    yield takeEvery(connectionDuck.actions.serverPushed.isType, function* (pushAction) {
            const pref: AdminPreferences = yield select(localAdminPreferencesDuck.selectPreferences)

            const {type, ...action}: FactoryAction<any> = pushAction.payload
            if(pref.liveEventFeedOverlay)
            notification.open({
                message: type,
                description: React.createElement(JSONTree, {value: action.payload}),
                duration: 20,

            })
        }
    )
}