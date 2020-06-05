import React from 'react'
import * as A from 'antd'
import {Descriptions} from 'antd'
import {Input, Form} from 'antd'
import useApi from '../../../../se-mobile-front/src/hooks/useApi'
import {useAsyncState} from '@sha/react-fp'
import {PromoVO} from 'se-iso/src/store/promoCodesDuck'
import {useSelector} from 'react-redux'
import {usersDuck, UserVO} from 'se-iso/src/store/usersDuck'
import JSONTree from '../../JSONTree'

export default ({promo, user}: {promo?: PromoVO, user?: UserVO}) => {
    const [userId, setUserId] = React.useState('')
    const [promoCode, setPromoCode] = React.useState('')
    const userIdToUse = user ? user.userId : userId
    const promoCodeToUse = promo ? promo.promoCode : promoCode
    const userByEmail = useSelector(usersDuck.selectEqOne({email: userIdToUse}))

    let requestId = userByEmail ? userByEmail.userId : userIdToUse


    const api = useApi()
    const promoCodeResponse = useAsyncState(
        api.isPromoAvailable,
        (promoCodeToUse && promoCodeToUse.trim().length && requestId)
            ? {promoCode: promoCodeToUse, userId: requestId}
            : null
    )

    return  <div>
                Проверить промокод для пользователя:
                <Form
                    layout={'inline'}
                >
                        <Form.Item
                            label="email or userId">
                            <Input
                                width={400}
                                title={'email or userId'}
                                value={userIdToUse}
                                onChange={e => setUserId(e.target.value)}
                                disabled={user !== undefined}>

                            </Input>
                        </Form.Item>

                        <Form.Item
                            label="Код">
                            <Input
                                width={200}
                                title={'Код'}
                                value={promoCodeToUse}
                                onChange={e => setPromoCode(e.target.value)}
                                disabled={promo !== undefined}>
                            </Input>
                        </Form.Item>
                    <Form.Item>{JSON.stringify(promoCodeResponse.value)}</Form.Item>
                </Form>

                </div>

}