import {RecipeVO, SEBootstrap} from './store'
import {calculatePFCDailyTargets} from './dailyTargets'
import {AssociativeArray} from '../../utils/src'
import * as random from '@sha/random'
import * as R from 'ramda'
import {ProfileVO} from './ProfileVO'
import {getMealsDigest, MealsDigest} from './getMealsDigest'
import {FullDish} from './getPlanDigest'

const revolve = <T> (ar: T[]): T => {
    let result = ar.shift()
    ar.push(result)
    return result
}

export type MenuDigest = ReturnType<typeof getMenuDigest>
// Специальное меню для профиля
export const getMenuDigest = ({bootstrap, profile, length = 1}: {bootstrap: SEBootstrap, profile: ProfileVO, length?: number}) => {

    const mealsDigest: MealsDigest = getMealsDigest(bootstrap, profile)

    const menu: {
        breakfast: FullDish
        snack1: FullDish
        dinner: FullDish
        snack2: FullDish
        supper: FullDish
        snack3: FullDish
    }[] = []


    if(!mealsDigest.mealsIsValid)
        return {
            ...mealsDigest,
            menuIsValid: false,
            menu,
            length,
        }


    const {ingredientsByName, ingredientsByAliases, meals, mealsIsValid} = mealsDigest

    const target =  calculatePFCDailyTargets(profile)

    let previousIngredientNamesByAliases: AssociativeArray<string> = {}


    const createMealTemplate = (purposeIndex: number): FullDish => {
        let recipe
        if(purposeIndex === 1)
            recipe = revolve(meals.breakfast)
        if(purposeIndex === 2)
            recipe = revolve(meals.snack1)
        if(purposeIndex === 3)
            recipe = revolve(meals.dinner)
        if(purposeIndex === 4)
            recipe = revolve(meals.snack2)
        if(purposeIndex === 5)
            recipe = revolve(meals.supper)
        if(purposeIndex === 6)
            recipe = revolve(meals.snack3)

        if(! recipe)
            return undefined

        const dish: FullDish = {...recipe}


        dish.list = dish.list.map( part => {

            if (part.isAlias) {
                const aliases = ingredientsByAliases[part.name]
                if (!aliases)
                    debugger
                let ingredient = aliases[Math.floor(Math.random() * aliases.length)]
                if(ingredient.name === previousIngredientNamesByAliases[part.name]) {
                    if(aliases.length > 1)
                        while(ingredient.name === previousIngredientNamesByAliases[part.name])
                            ingredient = random.randomElement(aliases)
                }
                previousIngredientNamesByAliases[part.name] = ingredient.name
                // const [ingredient, restIngredients] = revolve(menu.ingredientsByAliases[part.name])
                // menu.ingredientsByAliases[part.name] = restIngredients
                return {
                    ...ingredient,
                    ...part,
                    limits:  ingredient.limits || part.limits,
                    name: ingredient.name,
                    exampleWeight: part.exampleWeight / 4000 * target.totalDaily.kcals,
                    isAlias: false,
                    maxWeight: part.maxWeight,

                }
            }
            const ingredient = ingredientsByName[part.name]
            return {
                ...ingredientsByName[part.name],
                ...part,
                limits: ingredient.limits || part.limits,
                exampleWeight: part.exampleWeight / 4000 * target.totalDaily.kcals,
                maxWeight: part.maxWeight,
            }
        })
        return dish
    }

    type MealTemplate = ReturnType<typeof createMealTemplate>
    let repeats = 0

    for(let i = 0; i < length; i++) {
        const prevDay = menu[i-1]


        menu.push({
            snack1: createMealTemplate(2),
            snack2: createMealTemplate(4),
            snack3: createMealTemplate(6),
            breakfast: ( repeats === 0)
                ? createMealTemplate(1)
                : R.clone(prevDay.breakfast),
            dinner:  ( repeats === 0)
                ? createMealTemplate(3)
                : R.clone(prevDay.dinner),
            supper: ( repeats === 0)
                ? createMealTemplate(5)
                : R.clone(prevDay.supper),
        })
        repeats += 1
        if (repeats > profile.cookingsPerWeek)
            repeats = 0
    }
    return {
        ...mealsDigest,
        menuIsValid: true,
        menu,
        length
    }
}
