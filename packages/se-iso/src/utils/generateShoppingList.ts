import {IngredientVO, RecipePartVO} from '../store'
import {Day, PlanVO, FullPlan, FullDay} from '../getPlanDigest'
import {AssociativeArray, toAssociativeArray, toIndexedArray} from '../../../utils/src'
import * as R from 'ramda'


const monthlyFilter = (part: RecipePartVO) =>
    part.shopPriority >= 10 && part.shopPriority < 20

const weeklyFilter = (part: RecipePartVO) =>
    part.shopPriority >= 20

const dayliParts = (day: FullDay): RecipePartVO[] => ([
    ...day.dinner.list,
    ...day.supper.list,
    ...day.snack1.list,
    ...day.snack2.list,
    ...day.snack3.list,
    ...day.breakfast.list,
])



export type ShoppingListItem = {name: string, amount?: string, grams: number}

export type ShoppingList = {
    all: ShoppingListItem[],
    month: ShoppingListItem[],
    weeks: ShoppingListItem[][],
}

const sortByShopPriotity = R.sortBy(R.prop('shopPriority'))

export default (ingredients: IngredientVO[], plan: FullPlan): ShoppingList => {
    const days = plan.days

    ingredients = ingredients.filter(i => i.shopPriority !== undefined)

    const getSubList = (filter: (p: RecipePartVO) => boolean, days: FullDay[]) => {
        const totalList: AssociativeArray<IngredientVO> = toAssociativeArray<IngredientVO>(
            'name')(
            ingredients
                .filter(i => i.name !== 'Белок' && i.name !== 'Желток')
                .map(i => ({...i, basicWeight: 0}))
        )


        const allParts = R.flatten(days.map(dayliParts)) as any as RecipePartVO[]

        const neededParts = allParts.filter(filter)


        let eggWhite = 0
        let eggYolk = 0
        neededParts.forEach(p => {
                if (p.name === 'Белок')
                    eggWhite += p.exampleWeight
                else if (p.name === 'Желток')
                    eggYolk += p.exampleWeight
                else
                    totalList[p.name].basicWeight += p.exampleWeight
            }
        )


        const normalizedList = toIndexedArray(totalList)
            .filter(i => i.basicWeight > 0)
            .map(i => {
                    const grams = Math.ceil(i.basicWeight / i.shopMinimumDivision) * i.shopMinimumDivision

                    const [t1, t1000] = i.shopQuant.startsWith('мл') ? ['мл', 'л']  : ['гр', 'кг']

                    const amount = grams > 1000
                        ? Math.ceil(grams / 100) / 10 + ' ' + t1000
                        : grams + ' ' + t1


                    return {
                        name: i.shopName || i.name,
                        grams,
                        amount,
                        shopPriority: i.shopPriority,
                    }
                }
            )

        let eggs = 0
        if (eggWhite || eggYolk)
            eggs = Math.ceil(Math.max(eggWhite / 30, eggYolk / 20))

        if (eggs)
            normalizedList.push({name: 'Яйца', amount: eggs + ' шт.', shopPriority: 18, gramms: 20})

        return sortByShopPriotity(
            normalizedList
        )


    }

    return {
        all: getSubList((p : any) => true , days),
        month: getSubList(monthlyFilter, days),
        weeks: R.times( (i) =>
            getSubList(weeklyFilter, R.slice(i * 7,  (i + 1) * 7,days)),
            4
        )
    }
}


