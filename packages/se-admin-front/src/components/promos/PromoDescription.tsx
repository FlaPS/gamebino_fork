import React from 'react'
import {Descriptions} from 'antd'
import { Select } from 'antd'
import {
    defaultPromoVO,
    discountTypes,
    getDiscountPurpose,
    promoCodesDuck,
    PromoVO,
} from 'se-iso/src/store/promoCodesDuck'
import StringCell from '../cells/StringCell'
import SelectCell from '../cells/SelectCell'

import {duckProperty} from '../table/basicColumn'
import NumberCell from '../cells/NumberCell'
import {useSelector} from 'react-redux'
import {configDuck} from 'se-iso/src'
import * as R from 'ramda'
const { Option } = Select


const discountTypeOptions = Object.entries(discountTypes).map( ([k, v]) =>
    <Option value={k}>{v}</Option>
)

const PromoDescription = ({promo}: {promo: PromoVO}) => {
    const duck = promoCodesDuck
    const config = useSelector(configDuck.selectConfig)

    promo = R.mergeDeepRight(defaultPromoVO, promo) as any as PromoVO

    let regularPrice = getDiscountPurpose(promo.discount, config.payments.prices.planRegular).reducedPrice
    if(promo.restrictions.verifyStatus === 'yes')
        regularPrice = config.payments.prices.planRegular
    let verifiedPrice =  getDiscountPurpose(promo.discount, config.payments.prices.planVerified).reducedPrice
    if(promo.restrictions.verifyStatus === 'no')
        verifiedPrice = config.payments.prices.planVerified
    console.log('TRY RENDER PROMO',regularPrice, verifiedPrice, promo)

    return <Descriptions layout="vertical" bordered column={4}>
                <Descriptions.Item label="ID">
                    {promo.promoId}
                </Descriptions.Item>
                <Descriptions.Item label="Код">
                    <StringCell
                        record={promo}
                        property={duckProperty({dataIndex: 'promoCode', duck})}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="Сообщение о скидке">
                    <StringCell
                        record={promo}
                        property={duckProperty<PromoVO, string>({dataIndex: 'discount.message', duck})}
                    >
                    </StringCell>
                </Descriptions.Item>
                <Descriptions.Item label="Дата добавления">
                    {promo.creationDate}
                </Descriptions.Item>


                <Descriptions.Item label="Тип">
                    <SelectCell
                        record={promo}
                        property={duckProperty({dataIndex: 'discount.type', duck})}
                        style={{width:200}}
                    >
                        {discountTypeOptions}
                    </SelectCell>
                </Descriptions.Item>
                <Descriptions.Item label="Значение">
                   <NumberCell record={promo}
                                     property={duckProperty<PromoVO, number>({dataIndex: 'discount.value', duck})}
                            />

                </Descriptions.Item>
                <Descriptions.Item label="Ограничитель">
                    <NumberCell
                        record={promo}
                        property={duckProperty<PromoVO, number>({dataIndex: 'discount.stepSize', duck})}
                    >

                    </NumberCell>
                </Descriptions.Item>
                <Descriptions.Item label="Цены с промокодом">
                    <table style={{width: '300px'}}>
                        <tr>
                            <td style={{width: '200px'}}>Обычная цена</td>
                            <td  style={{textAlign: 'right'}}>{config.payments.prices.planRegular}</td>
                            <td>-></td>
                            <td  style={{textAlign: 'right'}}>{
                                  regularPrice
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>Верифицированная цена</td>
                            <td  style={{textAlign: 'right'}}>{config.payments.prices.planVerified}</td>
                            <td>-></td>
                            <td  style={{textAlign: 'right'}}>{
                                verifiedPrice
                            }</td>
                        </tr>
                    </table>

                </Descriptions.Item>

                <Descriptions.Item label="Действует для">
                    <SelectCell
                        record={promo}
                        property={duckProperty({dataIndex: 'restrictions.verifyStatus', duck})}
                        style={{width:200}}
                    >
                        <Option value={'any'}>Все пользователи</Option>
                        <Option value={'yes'}>Верифицированные</Option>
                        <Option value={'no'}>Неверифицированные</Option>
                    </SelectCell>
                </Descriptions.Item>

                <Descriptions.Item label="Макс пользователей">
                    <NumberCell
                        record={promo}
                        property={duckProperty<PromoVO, number>({dataIndex: 'restrictions.maxUsers', duck})}
                    >
                    </NumberCell>
                </Descriptions.Item>

                <Descriptions.Item label="Макс покупок на пользователя">
                    <NumberCell
                        record={promo}
                        property={duckProperty<PromoVO, number>({dataIndex: 'restrictions.maxActivationsPerUser', duck})}
                    >
                    </NumberCell>
                </Descriptions.Item>
                <Descriptions.Item label="Только на первую покупку после регистрации">
                    <SelectCell
                        record={promo}
                        property={duckProperty({dataIndex: 'restrictions.firstPurchase', duck})} style={{width:200}}
                    >
                        <Option value={false}>Все покупки</Option>
                        <Option value={true}>Только первая</Option>

                    </SelectCell>
                </Descriptions.Item>

    </Descriptions>
}

export default PromoDescription