import React from 'react'
import * as A from 'antd'
import {WithValueProps} from '@sha/react-fp'
import * as R from 'ramda'
import {PromoVO} from 'se-iso/src/store/promoCodesDuck'
import PromoDescription from './PromoDescription'
import {useSelector} from 'react-redux'
import {SEAdminState} from '../../store/adminReducer'
import {selectBootstrap} from '../../../../se-mobile-front/src/store'
import {Button} from 'antd'
type PromoCardProps = WithValueProps<PromoVO> & {onCopy: (value: PromoVO) => any}
import { Typography } from 'antd';

import {Descriptions} from 'antd'
import JSONTree from '../../JSONTree'
import TestPromoCode from '../users/TestPromoCode'
import useConfig from '../../../../se-mobile-front/src/hooks/useConfig'

const { Text } = Typography;

const PromoCard = ({value, onValueChange, onCopy}: PromoCardProps) => {


    const [config, utils] = useConfig()
    const users = useSelector((app: SEAdminState) => app.app.bootstrap.users)
    const selectUser = id => users.find( ({userId}) => userId == id )
    console.log(value)


    const copyButton = <Button
        onClick={() => onCopy(
            R.clone(value)
        )}
        type={'primary'}

    >
        Дублировать
    </Button>

    return  (
                    <A.Card title={value.name} extra={copyButton}>
                            <PromoDescription promo={value}/>
                            <TestPromoCode promo={value} />
                            <div>
                                <JSONTree value={value} />
                            </div>
                            <A.List
                                itemLayout="horizontal"
                                dataSource={value.activations}
                                renderItem={(item: PromoVO['activations'][0])  => {
                                    const user = selectUser(item.userId)

                                    if(!user)
                                        return <div>User not found {JSON.stringify(item)}</div>

                                    const params = new URLSearchParams({
                                        credentials : JSON.stringify({
                                            email: user.email,
                                            password: user.password,
                                        })
                                    })

                                    const loginAsPlanUser = config.frontendHost +
                                        '/app/in/myplans/' +item.info.planId+ '?' + params.toString()

                                    return  <A.List.Item
                                                actions={[<a href={loginAsPlanUser} target={'_blank'}>К плану</a>]}
                                            >

                                                <A.List.Item.Meta
                                                    title={<a>{user.email} {user.fullName}</a>}
                                                    description={new Date(item.timestamp).toISOString()}
                                                />

                                            </A.List.Item>
                                }}
                            />
                    </A.Card>
        )

}

export default PromoCard
