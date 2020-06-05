import React from 'react'
import * as A from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import localAdminPreferencesDuck from 'se-iso/src/store/localAdminPreferencesDuck'

export default () => {
    const preferences = useSelector(localAdminPreferencesDuck.selectPreferences)
    const dispatch = useDispatch()

    return <div>
                <A.Switch
                    checked={preferences.liveEventFeedOverlay}
                    onChange={ value =>
                        dispatch(localAdminPreferencesDuck.actions.updated({liveEventFeedOverlay: value}))
                    }
                /> Поток событий
            </div>
}