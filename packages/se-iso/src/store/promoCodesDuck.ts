import * as FSA from '@sha/fsa'
import {SEBootstrap} from './bootstrapDuck'
import {UserVO} from './usersDuck'
import * as R from 'ramda'
import {generateGuid, generatePassword} from '@sha/random'
import {SEServiceState} from '../../../se-service/src/store/serviceDuck'
import moment from 'moment'

export const defaultPromoVO: PromoVO = {
    restrictions: {
        verifyStatus: "any",
        firstPurchase: false,
        maxActivationsPerUser: 0,
        maxUsers: 0,
    },
    activations: [],
    discount: {
        message:'Вы можете воспользоваться промокодом',
        stepSize: 10,
        type: 'alphatest',
        value: 0,
    },
    name: 'БЕСПЛАТНО'
}

export const
    generateNewPromo = (): PromoVO => {
    const date = new Date()

    return {
        ...R.clone(defaultPromoVO),
        name: "Промокод от " + date.toISOString(),
        creationDate: date.toISOString(),
        promoId: generateGuid(),
        promoCode: generatePassword(),
        activations: [],

    } as any as PromoVO
}

export type DiscountType = 'alphatest' | 'percent' | 'reduce' | 'fixedPrice'

export const discountTypes: {[K in DiscountType]: string} = {
    fixedPrice:'Фиксированная цена',
    percent: 'Процент скидки',
    reduce: 'Вычитание цены',
    alphatest: 'Бесплатно',
}

export type PromoVO = {
    promoId: string
    promoCode: string
    name?: string

    creationDate: string

    activations: {
        userId: string
        email: string
        timestamp: number
        originalPrice?: number
        reducedPrice?: number
        description?: string
        info: {
            planId?: string
        }
    }[]

    restrictions: {
        validFromDate?: string
        validThruDate?: string
        verifyStatus?: 'yes' | 'no' | 'any'// undefined
        firstPurchase?: boolean // false
        maxActivationsPerUser?: number // 1
        maxUsers?: number  // 0
    }
    discount: Discount
}

export type Discount = {
    type: DiscountType
    value: number
    // minimum step size, in case of type === 'reduce' =>
    // Math.min(stepSize, price - value)
    // in case of type === 'percent' =>
    // Math.floor( (price - (price / 100 * value))/stepSize) * stepSize
    stepSize?: number
    message?: string
}

const uniqByProp = prop => R.uniqBy(R.prop(prop))

const filterByPropEq = (prop, value) =>
    R.filter(
        (item: any) =>
            String(item[prop]).toLowerCase() === value.toLowerCase()
    )



export const isPromoMismatch = (value: PromoPurpose): boolean =>
    value.hasOwnProperty('mismatch')

type DiscountPurpose =  {
    originalPrice?: number
    reducedPrice?: number
    mismatch?: string
}

export const getDiscountPurpose = ({type, value, stepSize, message}: Discount, originalPrice: number): DiscountPurpose => {
    let reducedPrice = originalPrice
    if (type === 'alphatest') {
        reducedPrice = 0
    }
     else if (type === 'reduce') {
        reducedPrice = Math.max(stepSize, originalPrice - value)
    }

    else if (type === 'fixedPrice') {
        reducedPrice = value
    }

    else if (type === 'percent') {
        if (!stepSize)
            stepSize = 1
        const amount = (originalPrice / 100 * value)
        reducedPrice = Math.floor((originalPrice - amount) / stepSize) * stepSize
    }

    return {
        reducedPrice,
        originalPrice,
    }
}

const getPromoPrice = (promoCode: PromoVO, user: UserVO, bootstrap: SEBootstrap): DiscountPurpose => {
    const {restrictions, activations} = promoCode

    const userPlans = bootstrap.plans.filter(p => p.userId === user.userId)

    const activationByThisUser = filterByPropEq('userId', user.userId)(activations).length
    if (restrictions.maxActivationsPerUser &&
        activationByThisUser >= restrictions.maxActivationsPerUser
    )
        return {mismatch: 'Вы уже использовали этот промокод'}

    if (restrictions.validFromDate && restrictions.validFromDate > new Date().toISOString())
        return {mismatch: 'Промокод ещё не начал работать'}

    if (restrictions.validThruDate && restrictions.validThruDate < new Date().toISOString())
        return {mismatch: 'Срок действия промокода истек'}

    if(restrictions.verifyStatus === 'yes' && user.verify !== 'done')
        return {mismatch: 'Промокод только для тренеров с подтвержденным аккаунтом'}

    else if(restrictions.verifyStatus === 'no' && user.verify === 'done')
        return {mismatch: 'Промокод для пользователей с неподтвержденным аккаунтом'}

    if (restrictions.firstPurchase) {
        if(userPlans.filter( p => p.isPayed).length)
            return {mismatch: 'Промокод только для первой покупки'}
    }


    if (restrictions.maxUsers &&
        restrictions.maxUsers <= uniqByProp('userId')(activations).length &&
        activationByThisUser === 0
    )
        return {mismatch: 'Промокод уже использован другими пользователями'}

    let price = user.verify === 'done'
        ? bootstrap.config.payments.prices.planVerified
        : bootstrap.config.payments.prices.planRegular

    return getDiscountPurpose(promoCode.discount, price)
}

export type NoPromo = undefined

export type PromoPurpose = {
    promo?: PromoVO,
    reducedPrice?: number
    originalPrice?: number,
    mismatch?: string

}

export const getPromoPurpose = (state: SEServiceState, userId: string, promoCode: string): PromoPurpose => {
    promoCode = promoCode.trim().toLowerCase()
    const bootstrap = state.app.bootstrap
    const promoCodes = filterByPropEq('promoCode', promoCode)(bootstrap.promoCodes)

    if (!promoCodes.length || promoCode.length === 0)
        return {mismatch: 'Промокод недействителен'}

    const user = R.find(R.propEq('userId', userId))(bootstrap.users)

    if (!user)
        return {mismatch: `Пользователь ${userId} не найден`}

    let result: DiscountPurpose
    let promo
    for ( promo of promoCodes) {
        result = getPromoPrice(promo, user, bootstrap)
        if(!result.mismatch) {
            break
        }
    }

    let obj
    if(result['mismatch'])
        obj =  result as any
    else if(promo){
        obj = {
            promo,
            ...result,
        }
    }

    return obj
}


const {reducer, actions, ...duck} =  FSA.createCRUDDuck<PromoVO, 'promoId'>('promoCodes', 'promoId')


export const promoCodesDuck = {
    ...duck,
    actions,
    reducer,
    ...duck.optics,
}
