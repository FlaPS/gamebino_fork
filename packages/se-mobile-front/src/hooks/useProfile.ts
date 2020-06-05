import React, {useCallback} from 'react'
import * as router from '@sha/router'
import * as R from 'ramda'
import {ProfileVO} from 'se-iso/src/ProfileVO'
import useMergedState from '@sha/react-fp/src/hooks/useMergedState'
import getBlankProfile from '../utils/getBlankProfileState'
import urlStorage from '../utils/urlStorage'
import {getPlanDigest} from 'se-iso/src'
import {useSelector} from 'react-redux'
import {selectBootstrap} from '../store'



export default (initial: Partial<ProfileVO> = urlStorage.getItem('profile') || getBlankProfile()) => {
    const [state, mergeState, mergeValue] = useMergedState(initial)
    const bootstrap = useSelector(selectBootstrap)
    const digest = getPlanDigest(bootstrap, state as any as ProfileVO)

    const mergeProfile = (profile: Partial<ProfileVO>): ProfileVO => {
        const result = R.mergeDeepRight(state, profile)
        mergeState(profile)
        //urlStorage.setItem('profile', result)
        return result
    }
    console.info('HOOK update useProfile', state, digest.meals)
    return {
        digest,
        mergeProfile,
        profile: state as any as ProfileVO,
        mergeValue,
        initial,

    }
}
