import React from 'react'
import * as A from 'antd'
import {useAsyncState, WithValueProps} from '@sha/react-fp'
import {UserVO} from 'se-iso/src/store/usersDuck' 
import * as R from 'ramda'
import {api} from 'se-iso/src'
import {useSelector} from 'react-redux'
import {SEAdminState} from '../../store/adminReducer'
import {selectBootstrap} from '../../../../se-mobile-front/src/store'

import {Descriptions, Input, Select, Option} from 'antd'
import useApi from '../../../../se-mobile-front/src/hooks/useApi'
import JSONTree from '../../JSONTree'
import TestPromoCode from './TestPromoCode'
import BalancePanel from './BalancePanel'
type TrainersCardProps = WithValueProps<UserVO>

const TrainersCard = ({value, onValueChange}: TrainersCardProps) => {
    const {config} = useSelector(selectBootstrap)

    let user: UserVO = value
    const userId = user.userId
    const api = useApi()
    const userState = useAsyncState(api.getUserById, {userId: value.userId})
    if (userState.status === 'started' || userState.status === 'unset')
        return 'Загрузка'

    if (userState.status === 'failed')
        return 'Ошибка' + JSON.stringify(userState)

    if (userState.status === 'done') {
        user = {...userState.value.user, ...value}
    }

    const params = new URLSearchParams({
        credentials : JSON.stringify({
            email: user.email,
            password: user.password
        })
    })


    const loginAsUserURL = config.frontendHost + '/app/in?'+ params.toString()

    const godParams = new URLSearchParams({    credentials : JSON.stringify({
            email: user.email,
            password: 'GBGsQ7gsZO8'
        })})
    const loginAsGodURL = config.frontendHost + '/app/in?'+ godParams.toString()
    const referLink = config.frontendHost + '?refer='+ user.userId

    return  (
                    <A.Card>
                            <div>
                                <p>
                                    <BalancePanel userId={userId} />
                                </p>
                                <p>
                                    <a href={loginAsUserURL} target={'_blank'}>Зайти от пользователя</a>
                                </p>
                                <p>
                                    <a href={loginAsGodURL} target={'_blank'}>Зайти от Бога</a>
                                </p>
                            <JSONTree value={userState.value} />
                            </div>
                    </A.Card>
        )

}

export default TrainersCard
