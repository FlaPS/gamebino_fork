
import {ProfileVO} from './ProfileVO'
import {getMenuDigest, MenuDigest} from './getMenuDigest'
import {Day, daysGenerator, Dish, DishPart, drainPlanDays, FullDay, FullDish, FullDishPart} from './getPlanDays'
export * from './getPlanDays'

export type PlanT<Full extends true | false = true> = {
    isExternal?: boolean
    planId: string
    userId: string
    profile: ProfileVO
    scheme?: any
    days?: (Full extends true ? FullDay : Day)[]
    isPayed?: boolean
    paidAt: string
    isPayedByClient?: boolean
    orderTimestamp?: number
    orderInfo?: {}
    createdAt?: string
    planIsInvalid?: boolean
}

export type PlanVO = PlanT<false>
export type FullPlan = PlanT<true>
type Plan = FullPlan

export type MealTitle = 'breakfast' | 'snack1' | 'dinner' | 'snack2' | 'supper' | 'snack3'

export const mealTitles: {prop: MealTitle, name: string}[] = [
    {
        prop: 'breakfast',
        name: 'Завтрак',
    },
    {
        prop: 'snack1',
        name: 'Перекус 1',
    },
    {
        prop: 'dinner',
        name: 'Обед',
    },
    {
        prop: 'snack2',
        name: 'Перекус 2',
    },
    {
        prop: 'supper',
        name: 'Ужин',
    },
    {
        prop: 'snack3',
        name: 'Перекус 3',
    }
]

export const getPlanDigest = (bootstrap: any, profile: ProfileVO, length: number = 1) => {
    const digest: MenuDigest = getMenuDigest({bootstrap, profile, length})
    let days = []
    if(digest.mealsIsValid)
        days = daysGenerator(digest).days
    return {
        fullDays: days,
        days: drainPlanDays(days),
        daysIsValid: days.length > 0,
        ...digest
    }
}

/*

export const getPlanStatus = (bootstrap: any, plan: PlanVO) => {
    if(plan.isPayed)
        return 'payed'

    const digest = 
    
    
}
*/