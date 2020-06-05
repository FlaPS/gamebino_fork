import * as FSA from '@sha/fsa'
import {Limit, SourceType} from './recepiesDuck'

export type IngredientVO = {
    proposal: string
    ingredientId: string
    mealName?: string
    complexId?: string
    replaceAliases?: string[]
    name: string
    proteins: number
    goals: number[]
    fats: number
    carbons: number
    calories: number
    basicWeight: number
    rank?: number
    nameForQuiz?: string
    questionIds?: number[]
    questionIngredientsGroup?: string
    sourceType?: SourceType
    minimumDivision?: number
    // коэффициент готового продукта
    cookedMultiplier: number
    shopName?: string
    shopQuant?: string
    shopMinimumDivision: number
    shopPriority: number
    limits: Limit[] | number | undefined
    limitsEq?: boolean
}


const duck =  FSA.createCRUDDuck<IngredientVO, 'ingredientId'>('ingredients', 'ingredientId')
export const ingredientsDuck = {
    ...duck,
    ...duck.optics,
}
