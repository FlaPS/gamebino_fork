import {MenuDigest} from './getMenuDigest'
import {IngredientVO} from './store/ingredientsDuck'

import {calculatePFCDailyTargets, MealTarget} from './dailyTargets'
import * as R from 'ramda'
import {RecipePartVO} from './store/recepiesDuck'

const revolve = <T> (ar: T[]): [T, T[]] => {
    const [result, ...rest] = ar
    return [result, [...rest, result]]
}

const isMilk = part => part.name.toLowerCase().includes('олоко')


export type DishPart = {
    part: number
    name: string
    weight: number
}

export type Dish = {
    recipe: string
    list: DishPart[]
}

export type Day = {
    breakfast: Dish
    snack1: Dish
    snack2: Dish
    snack3: Dish
    supper: Dish
    dinner: Dish
}

export type FullDishPart = IngredientVO & RecipePartVO & {
    top?: true
    fixed?: 'fats' | 'prots' | 'carbons'
    inputWeight?: number
    tunedWeight?: number

}

export type FullDish = {
    purpose: number
    excludeLosingWeight: boolean
    recipeId: string
    name: string
    recipeIndex: string
    priority: number
    list: FullDishPart[]
}

export type FullDay = {
    breakfast: FullDish
    snack1: FullDish
    snack2: FullDish
    snack3: FullDish
    supper: FullDish
    dinner: FullDish
}


export const getListPFC = (list: FullDishPart[]) => {

    return list.reduce((nuts, part) => {
        return {
            kcals: nuts.kcals + part.exampleWeight * part.calories / 100,
            carbons: nuts.carbons + part.exampleWeight * part.carbons / 100,
            fats: nuts.fats + part.exampleWeight * part.fats / 100,
            proteins: nuts.proteins + part.exampleWeight * part.proteins / 100,
        }
    }, {kcals: 0, carbons: 0, fats: 0, proteins: 0})
}
export const getDayFPC = ({breakfast,snack3,snack2,snack1,supper,dinner}: FullDay) =>
    [breakfast,snack3,snack2,snack1,supper,dinner].reduce(
        (result, meal) => {
            const mealNuts = getListPFC(meal.list)
            return {
                kcals: mealNuts.kcals + result.kcals,
                proteins: mealNuts.proteins + result.proteins,
                carbons: mealNuts.carbons + result.carbons,
                fats: mealNuts.fats + result.fats,
            }
        },
        {kcals: 0, carbons: 0, fats: 0, proteins: 0}
    )


export const daysGenerator = (menuDigest: MenuDigest) => {
    const {profile, length, menu, ingredientsByAliases} = menuDigest
    const isGroast = (part: RecipePartVO) => {
        return Boolean(ingredientsByAliases['Каша'].find( i => i.name ===  part.name))
    }
    const target =  calculatePFCDailyTargets(profile)

    const getMaxWeightForPart = (part: FullDishPart): number => {
        if (typeof part.limits === "number")
        {
            if (part.sourceType)
                return Math.ceil(part.limits * target.totalDaily[part.sourceType] / 100)

            return part.exampleWeight
        }
        if (!part.limits)
        {
            return part.exampleWeight
        }

        if(part.name.includes('олоко')) {
            part.sourceType = 'carbons'
        }
        let lookupValue = target.totalDaily[part.sourceType]

        const sortedLimits = R.sortBy(R.prop('value'), part.limits)

        let i = 0;
        try {
            while(i < sortedLimits.length && sortedLimits[i].value < lookupValue) {
                i++
            }
        }catch (e) {
            //  debugger
        }
        i = Math.min(i, sortedLimits.length - 1)

        return sortedLimits[i].maxWeight
    }

    const getConstWeightForPart = (part: FullDishPart): number => {
        if (!part.limitsEq)
            return undefined
        const sortedLimits = R.sortBy(R.prop('value'), part.limits)
        let lookupValue = target.totalDaily[part.sourceType]
        let i = 0;
        try {
            while(sortedLimits[i].value < lookupValue && i < sortedLimits.length) {
                i++
            }
        }catch (e) {
            //  debugger
        }
        i = Math.min(i, sortedLimits.length - 1)

        return sortedLimits[i].maxWeight
    }

    const tuneMeal = (recipe: FullDish, mealTarget: MealTarget): FullDish => {

        let i = 0;

        while (getListPFC(recipe.list).kcals < mealTarget.kcals.min + 20 && i < 15) {

            (recipe.list || []).forEach(p => {
                if (!p.inputWeight)
                    p.inputWeight = p.exampleWeight

                const max = getMaxWeightForPart(p)
                let exampleWeight = Math.min(p.exampleWeight * 1.2, max)
                p.exampleWeight = exampleWeight

                p.tunedWeight = exampleWeight

            })

            i++;
        }
        (recipe.list || []).forEach(p => {
            if (isNaN(p.inputWeight))
            {
                p.inputWeight = p.tunedWeight = p.exampleWeight
            }

        })
        //}
        return normalizeIngredients(recipe)
    }

    const generateDay = (index: number): FullDay => {
        const breakfastRaw = menu[index].breakfast
        const dinnerRaw = menu[index].dinner
        const supperRaw = menu[index].supper
        const snack1Raw = menu[index].snack1
        const snack2Raw = menu[index].snack2
        const snack3Raw = menu[index].snack3

        const breakfast = tuneMeal(breakfastRaw, target.meals[0])
        const snack1 = tuneMeal(snack1Raw, target.meals[1])

        const snack2 = tuneMeal(snack2Raw, target.meals[3])

        const snack3 = tuneMeal(snack3Raw, target.meals[5])

        const supper = tuneMeal(supperRaw, target.meals[4])


        const previousIngredients = [...breakfast.list, ...snack1.list, ...snack2.list, ...snack3.list, ...supper.list]


        const dinnerExampleTarget = getListPFC(previousIngredients)


        const dinner = tuneMeal(dinnerRaw, target.meals[2])
        /*{
            kcals:{
                min: target.totalDaily.kcals - dinnerExampleTarget.kcals,
                max: target.totalDaily.kcals - dinnerExampleTarget.kcals,
            },
            proteins:{
                min: target.totalDaily.proteins - dinnerExampleTarget.proteins,
                max: target.totalDaily.proteins - dinnerExampleTarget.proteins,
            },
            fats:{
                min: target.totalDaily.fats - dinnerExampleTarget.fats,
                max: target.totalDaily.fats - dinnerExampleTarget.fats,
            },
            carbons:{
                min: target.totalDaily.carbons - dinnerExampleTarget.carbons,
                max: target.totalDaily.carbons - dinnerExampleTarget.carbons,
            },
        })*/

        let allParts = [ ...dinner.list,  ...supper.list, ...snack2.list, ...snack1.list, ...snack3.list, ...breakfast.list, ]
        let mostCarbons = [...allParts, ...dinner.list].filter(p =>
            p.sourceType === 'carbons' || (p.carbons > 10 && (p.carbons > (p.fats + p.proteins) * 0.7))
        )

        let mostFats = [...allParts, ...dinner.list].filter(p =>
            p.sourceType === 'fats' || (p.fats > 10 && (p.fats > (p.carbons + p.proteins) * 0.7))
        )

        let mostProteins =  [...allParts, ...dinner.list].filter(p =>
            p.sourceType === 'proteins' || ( p.proteins > 10 && (p.proteins > (p.fats + p.carbons) * 0.7) )
        )

        const getPartsBalance = (list: FullDishPart[]) =>
            getListPFC(list)

        // console.log('fixing')
        const baseDiff = 10
        for (let i = 0 ; i < 500; i ++) {
            let maxDiff = 3
            let currentBalance

            currentBalance = getPartsBalance(allParts)
            const proteinsDisbalance = target.totalDaily.proteins - currentBalance.proteins
            if (Math.abs(proteinsDisbalance) >= 0) {

                let [mostPart, newMostProteins] = revolve(mostProteins)
                mostProteins = newMostProteins

                //console.log('proteins disbalance', proteinsDisbalance)
                if (mostPart) {

                    const proteinsPerGramm = mostPart.proteins / 100

                    //console.log('proteons per gramm', proteinsPerGramm)
                    const targetGramms = proteinsDisbalance / proteinsPerGramm


                    const grammsToAdd = targetGramms > 0
                        ? Math.min(targetGramms, maxDiff * (String(mostPart.recipeIndex).startsWith('3') ? 2 :1))
                        : Math.max(targetGramms, -maxDiff)


                    const newWeight = Math.min(
                        mostPart.exampleWeight + grammsToAdd,
                        getMaxWeightForPart(mostPart)
                    )
                    //      console.log('add gramms', 'to', mostPart.name, mostPart.exampleWeight, grammsToAdd, newWeight)

                    const constWeight = getConstWeightForPart(mostPart)
                    mostPart.fixed = 'prots'
                    mostPart.exampleWeight = constWeight || Math.max(newWeight, mostPart.minimumDivision)

                }

            }


            currentBalance = getPartsBalance(allParts)
            const carbonsDisbalance = target.totalDaily.carbons - currentBalance.carbons
            if (Math.abs(carbonsDisbalance) >= 0) {
                const mult = carbonsDisbalance > 1 ? -1 : 1
                let [mostPart, newMostCardons] = revolve(mostCarbons)
                mostCarbons = newMostCardons
                if(mostPart) {

                    const carbonsPerGramm = mostPart.carbons / 100

                    //console.log('proteons per gramm', proteinsPerGramm)
                    const targetGramms = Math.round(carbonsDisbalance/ carbonsPerGramm)


                    const grammsToAdd = targetGramms > 0
                        ? Math.min(targetGramms, maxDiff* (String(mostPart.recipeIndex).startsWith('3') ? 2 :1))
                        : Math.max(targetGramms, -maxDiff)


                    const newWeight = Math.min(
                        mostPart.exampleWeight + grammsToAdd,
                        getMaxWeightForPart(mostPart)
                    )
                    //    console.log('add gramms', 'to', mostPart.name, mostPart.exampleWeight, grammsToAdd, newWeight)
                    const constWeight = getConstWeightForPart(mostPart)
                    mostPart.exampleWeight = constWeight || Math.max(newWeight, mostPart.minimumDivision)
                    mostPart.fixed = 'carbons'
                    if (isGroast(mostPart)) {
                        const milk = allParts.find( (part: RecipePartVO) => isMilk(part) && part.recipeIndex === mostPart.recipeIndex)
                        if(milk) {
                            milk.exampleWeight = mostPart.exampleWeight * 2
                        }
                    }
                }
            }

            currentBalance = getPartsBalance(allParts)
            const fatsDisbalance = target.totalDaily.fats - currentBalance.fats
            if (Math.abs(fatsDisbalance) >= 0) {
                const mult = fatsDisbalance > 1 ? -1 : 1
                let [mostPart, newMostFats] = revolve(mostFats)
                mostFats = newMostFats
                if(mostPart) {
                    const fatsPerGramm = mostPart.fats / 100

                    //console.log('proteons per gramm', proteinsPerGramm)
                    const targetGramms = Math.round(fatsDisbalance/ fatsPerGramm)


                    const grammsToAdd = targetGramms > 0
                        ? Math.min(targetGramms, maxDiff * (String(mostPart.recipeIndex).startsWith('3') ? 2 :1))
                        : Math.max(targetGramms, -maxDiff)


                    const newWeight = Math.min(
                        mostPart.exampleWeight + grammsToAdd,
                        getMaxWeightForPart(mostPart)
                    )
                    mostPart.fixed = 'fats'
                    //   console.log('add gramms', 'to', mostPart.name, mostPart.exampleWeight, grammsToAdd, newWeight)
                    const constWeight = getConstWeightForPart(mostPart)
                    mostPart.exampleWeight = constWeight || Math.max(newWeight, mostPart.minimumDivision)
                }
            }



        }

        allParts.forEach(
            part => {
                part.exampleWeight = Math.round(part.exampleWeight / part.minimumDivision) * part.minimumDivision
                part.maxWeight = getMaxWeightForPart(part)
                if (getMaxWeightForPart(part) === part.exampleWeight)
                    part.top = true
            }

        )
        return {
            breakfast,
            snack3,
            snack2,
            snack1,
            supper,
            dinner
        }
    }

    const days: FullDay[] = []

    for (let i = 0; i < length; i++)
        days.push(generateDay(i))

    return {
        ...menuDigest,
        isDaysValid: days.length > 0,
        days
    }
}
export const drainPlanDays = (days: FullDay[]): Day[] => {
    const drainDishPart = (fullPart: FullDishPart): DishPart => ({
        name: fullPart.name,
        weight: fullPart.exampleWeight,
        part: fullPart.part,
    })

    const drainMeal = (fullDish: FullDish): Dish => ({
        recipe: fullDish.recipeIndex,
        list: fullDish.list.map(drainDishPart)
    })

    return days.map( (day): Day =>
        ({
            breakfast: drainMeal(day.breakfast),
            dinner: drainMeal(day.dinner),
            snack1: drainMeal(day.snack1),
            snack2: drainMeal(day.snack2),
            snack3: drainMeal(day.snack3),
            supper: drainMeal(day.supper),
        })
    )
}

const normalizeIngredients = (meal: FullDish) => {
    return {
        ...meal,
        list: meal.list.map( part => ({
            ...part,
            exampleWeight: part.exampleWeight > 30
                ? Math.floor(part.exampleWeight / 10 ) * 10
                : Math.ceil(part.exampleWeight / 5) * 5

        }))
    }
}


