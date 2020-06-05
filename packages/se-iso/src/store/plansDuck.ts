import {ProfileVO} from '../ProfileVO'
import {FullDay, Day, Dish, FullDish} from '../getPlanDays'
import * as FSA from '@sha/fsa'
import {CredentialsVO} from '../api'
import {SEBootstrap} from './bootstrapDuck'
import { toAssociativeArray } from '../../../utils/src'
import {FullPlan, PlanT, PlanVO} from '../getPlanDigest'


const planDuckRaw = FSA.createCRUDDuck<PlanVO, 'planId'>('plans', 'planId', {days:[]})

const factory = planDuckRaw.factory

export const actions = {
    ...planDuckRaw.actions,
    profileFilled: factory<{profile: ProfileVO, planId: string, userId: string}>('profileFilled')
}

const reducer = planDuckRaw.reducer//actions.fetchUsers.asyncReducer

export const getPlansBoughtByUser = (plans: PlanVO[], userId: string) =>
    plans.filter(p => p.userId === userId && p.isPayed)

export const plansDuck = {
    reducer,
    factory,
    actions,
    selectFullPlan: (planIdOrPlan) => (state: {app: { bootstrap: SEBootstrap}}) => {
        const ingredients = toAssociativeArray('name')(state.app.bootstrap.ingredients)
        const recipes = toAssociativeArray('recipeIndex')(state.app.bootstrap.recipes)


        const vo = typeof planIdOrPlan === 'string' 
            ? planDuckRaw.optics.selectById(planIdOrPlan)(state)
            : planIdOrPlan

        const fullDush = (dish: Dish): FullDish => ({
            ...recipes[dish.recipe],
            list: dish.list.map( (part, index) => ({
                ...ingredients[part.name],
                ...recipes[dish.recipe].list[part.part || index],
                ...part,
                exampleWeight: part.weight,
            }))
        })
        
        const plan: FullPlan = {
            ...vo,
            days: vo.days.map( (day:Day): FullDay =>
                ({
                    breakfast: fullDush(day.breakfast),
                    dinner: fullDush(day.dinner),
                    snack1: fullDush(day.snack1),
                    snack2: fullDush(day.snack2),
                    snack3: fullDush(day.snack3),
                    supper: fullDush(day.supper),
                })    
            )
        }
        return plan
    },
    ...planDuckRaw.optics,
    selectPlansBoughtByUser: (userId: string) =>
        planDuckRaw.optics.selectEq({userId: userId, isPayed: true}),

    selectPlansByUserId: (userId: string) => 
        planDuckRaw.optics.selectEq({userId}),

    getDemoPlanDuration: (plan: PlanT<any>) =>
        plan.days.length === 1 
            ? '1 день' 
            : '1 неделю',

}
