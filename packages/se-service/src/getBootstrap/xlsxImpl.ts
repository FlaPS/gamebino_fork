import xlsx from 'node-xlsx'
import * as path from "path"
import {ingredientsDuck, IngredientVO, Limit, RecipePartVO, RecipeVO, SourceType} from 'se-iso/src'
import {AssociativeArray} from '@sha/utils'
import {undefined} from 'io-ts'
import * as Random from '@sha/random'
import * as R from 'ramda'
import getQuiz from './getQuiz'

const quizSheetMap = [
    'questionId',
    'title',
]

const sourceTypesMap: AssociativeArray<SourceType> = {
    'Калории': 'kcals',
    'Ничего': 'kcals',
    'Белок': 'proteins',
    'Углеводы': 'carbons',
    'Жир': 'fats',
}


const isIngridientRowInMealsSheet = (arr: any[]) =>
    arr[8] !== undefined && arr[8] !== 'вес'

const normalizeValue = (value: any) =>
    Math.round(Number(value) * 100) / 100



const parseLimits = (value: string | number | undefined, mult = 1): Limit[] | undefined | number => {
    if (typeof value === "undefined") {
        return null
    }

    if (typeof value === "number")
        return Number(value * 100) * mult

    if (value.endsWith('%'))
        return Number(R.init(value))

    const sign = value.startsWith('=') ? 'eq' : 'less'


    if(value.startsWith('='))
        value = R.tail(value)

    const parts = value.split('\r').join('').split('\n').join('')
        .split(',').map( s => s.trim())
        .filter(s => s !== "")

    const result: Limit[] = []

    for(let i = 0; i < parts.length; i += 2)
        result.push({value: Number(parts[i + 1]), maxWeight: Number(parts[i]) *  mult, sign})

    return result
}


const readIntArray = (row, defaultValue = []) => {
    if (row === 0 || row === '0')
        return [0]
    if (!row)
        return defaultValue

    const str = String(row)

    const result = str.split(',').map ( str => str.trim()).map(s => Number(s))
    if(result.find(v => typeof v !== 'number'))
        throw new Error('Row is not array of numbers ' + row)
    return result
}


export default () => {
    const workSheetsFromFile = xlsx.parse(path.join(__dirname,  '/db.xlsx')) as any


    let sheet = workSheetsFromFile[1].data


    const getIngredientByName = (name: string): Partial<IngredientVO> => {
        let ingredient: Partial<IngredientVO> = ingredients.find( i => i.name === name)

        if (!ingredient) {
            ingredient = {name, replaceAliases: []}
            ingredients.push(ingredient as any as IngredientVO)
        }

        return ingredient
    }

    const updateIngredient = (name: string, props: Partial<IngredientVO>): Partial<IngredientVO> => {
        if(!name)
            return props
        const ingredient = getIngredientByName(name)
        Object.entries(props).forEach(
            ([prop, value]) =>
                ingredient[prop] = (typeof value === 'undefined') ? ingredient[prop] : value
        )

        return ingredient
    }

    const ingredients: IngredientVO[] = []

    const parseReplaceAliases = (value: string) => {
        if (!value)
            return []

        const parts = value.split(',')
        const result = parts.map(s => s.trim())
        return result
    }

    let n = 2
    while(sheet[n] && sheet[n][0] !== undefined) {
        const row = sheet[n]
        updateIngredient(
            row[0],
            {
                nameForQuiz: row[1],
                questionIds: readIntArray(row[2], []),
                questionIngredientsGroup: row[3],
                sourceType: sourceTypesMap[row[4]],
                replaceAliases: parseReplaceAliases(row[5]),
                goals: readIntArray(row[6], [0,1,2]),
                minimumDivision: Number(row[7]),
                cookedMultiplier: (typeof row[8] === 'number') ? Number(row[8]) : 1,
                shopName: row[9] ? row[9] : row[0],
                shopQuant: row[10] || 'гр. / кг',
                shopMinimumDivision: Number(row[12]),
                shopPriority: row[13],
                proteins: row[14] || 0,
                fats: row[15] || 0,
                carbons: row[16] || 0,
                calories: row[17] || 0,
                limits: parseLimits(row[18]),
                limitsEq: typeof row[18] === 'string' && row[18].startsWith('='),
            }
        )
        n++
    }


    let mealsSheet: any[] = workSheetsFromFile[0].data
    let recipes: RecipeVO[] = []

    let previousRecipe: RecipeVO = {} as any as RecipeVO


    let listItemIndex = 0
    for (let i = 2; i < mealsSheet.length; i++) {
        const item = mealsSheet[i]
        if (!item[1])
            continue
        if (item[1] !== previousRecipe.recipeIndex) {
            if (previousRecipe.recipeId)
                recipes.push(previousRecipe)
            listItemIndex = 0
            previousRecipe = {
                recipeIndex: item[1],
                name: item[2],
                recipeId: Random.generateGuid(),
                list: [],
                priority: item[9] || 1,
            }
        }
        let listItem: Partial<RecipePartVO> = {
            partIndex: listItemIndex,
            required: Boolean(item[8]),
            goals: readIntArray(item[10], [0,1,2]),//Boolean(item[10] === 'поддерж/набор'),
            trueCarbons: Boolean(item[5]),
            trueFats: Boolean(item[6]),
            trueProteins: Boolean(item[7]),
            recipeIndex: item[1],
            part: previousRecipe.list.length,
            cookInfo: item[13],
        }

        listItemIndex++

        if (listItem.trueProteins)
            listItem.sourceType = 'proteins'
        if (listItem.trueCarbons)
            listItem.sourceType = 'carbons'
        if (listItem.trueFats)
            listItem.sourceType = 'fats'

        if (item[4]){
            if(typeof item[4] === 'number')
            listItem = {
                ...listItem,
                limits: parseLimits(item[11]),
                limitsEq: typeof item[11] === 'string' && item[11].startsWith('='),
                exampleWeight: typeof item[4] === 'number' ? item[4] : (mealsSheet[i - 1][4]) * 2,
            }
            else
                listItem = {
                ...listItem,
                limits: parseLimits((mealsSheet[i - 1][4]) ,2),
                //limitsEq: typeof item[11] === 'string' && item[11].startsWith('='),
                exampleWeight: (mealsSheet[i - 1][4]) * 2,
            }


        }
        else {
            listItem = {
                ...listItem,
                limits: parseLimits(mealsSheet[i - 1][11], 2),

                exampleWeight: item[4] || mealsSheet[i - 1][4] * 2,
            }
        }

        listItem.name = item[3]

        if (!ingredients.find( i => i.name === item[3])) {
            listItem.isAlias = true
        }

        previousRecipe.list.push(listItem)
    }



    const quiz = getQuiz(workSheetsFromFile[3].data)


    return {
        ingredients,
        recipes,
        quiz,
    }

}


