import React from 'react'
import {SEISOConfig} from 'se-iso/src/SEISOConfig'
import {useSelector} from 'react-redux'
import {configDuck} from 'se-iso/src'
import moment from 'moment'
//import 'moment/time-zone'
import * as R from 'ramda'


const getDateTime = value =>
    R.take(16, value) as any as string

export default () => {
    const config: SEISOConfig = useSelector(configDuck.selectConfig)
    const serviceTimezoneOffset = 0
    const utils = {
        localToService: (isoValue, offsetMins = serviceTimezoneOffset) =>
            isoValue
                ? new Date(new Date(getDateTime(isoValue)).getTime() + offsetMins * 60 * 1000).toISOString()
                : undefined,

        serviceToLocal: (isoValue, offsetMins = serviceTimezoneOffset) =>
            isoValue
                ? R.take(16, new Date(new Date(getDateTime(isoValue)).getTime() - offsetMins * 60 * 1000).toISOString())
                : undefined
    }
    return [{
        ...config,
        serviceTimezoneOffset,
    }, utils]
}