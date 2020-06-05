import * as FSA from '@sha/fsa'
import {IngredientVO} from './ingredientsDuck'

export type Limit = {
    value: number
    sign?: 'eq' | 'less'
    maxWeight: number
}

export type LimitsExample = {
    kcals: Limit[],
    proteins: Limit[],
    fats: Limit[],
    carbons: Limit[],
    addon: Limit[],
}

export const getExampleLimits = (weight: number): LimitsExample => ({
    kcals: [
        {
            value: 1500,
            maxWeight: Math.ceil(weight * 0.8 / 5) * 5
        },
        {
            value: 2000,
            maxWeight: Math.ceil(weight / 5) * 5
        },
        {
            value: 2500,
            maxWeight: Math.ceil(weight * 1.2 / 5) * 5
        },
        {
            value: 3000,
            maxWeight: Math.ceil(weight * 1.4 / 5) * 5
        },
        {
            value: 4000,
            maxWeight: Math.ceil(weight * 1.5 / 5) * 5
        },
        {
            value: 6000,
            maxWeight: Math.ceil(weight * 1.8 / 5) * 5
        },
    ],
    proteins: [
        {
            value: 130,
            maxWeight: 160,
        },
        {
            value: 180,
            maxWeight: 320,
        },
        {
            value: 250,
            maxWeight: 400,
        },
        {
            value: 300,
            maxWeight: 500,
        },
        {
            value: 400,
            maxWeight: 600,
        },
        {
            value: 500,
            maxWeight: 700,
        },
    ],
    fats: [
        {
            value: 80,
            maxWeight: 30,
        },
        {
            value: 120,
            maxWeight: 40,
        },
        {
            value: 160,
            maxWeight: 50,
        },
        {
            value: 200,
            maxWeight: 60,
        },
        {
            value: 240,
            maxWeight: 70,
        },
        {
            value: 280,
            maxWeight: 80,
        },
    ],
    carbons: [
        {
            value: 100,
            maxWeight: 100,
        },
        {
            value: 200,
            maxWeight: 120,
        },
        {
            value: 300,
            maxWeight: 140,
        },
        {
            value: 400,
            maxWeight: 160,
        },
        {
            value: 500,
            maxWeight: 200,
        },
        {
            value: 600,
            maxWeight: 300,
        }
    ],
    addon: [
        {
            value: 6000,
            maxWeight: 1000,
        }
    ]
})

export type SourceType = 'kcals' | 'proteins' | 'fats' | 'carbons' | 'addon'

export type RecipePartVO = {
    partIndex: number
    recipeIndex: number | string
    required?: boolean
    isAlias?: boolean
    name?: string
    minimumDivision: number
    maxWeight: number
    exampleWeight: number
    trueProteins: boolean
    trueCarbons: boolean
    trueFats: boolean
    sourceType?: SourceType
    part: number
    weight: number
    cookInfo: string | undefined

} & Partial<IngredientVO>

export type recipePurposes = ['breakfast' | 'snack1' | 'dinner' | 'snack2' | 'supper' | 'snack3']

export type RecipeVO = {
    purpose: number
    excludeLosingWeight: boolean
    recipeId: string
    name: string
    recipeIndex: number | string
    priority: number
    list: RecipePartVO[]
}

const recipesDuckRaw = FSA.createCRUDDuck<RecipeVO, 'recipeId'>('recipes', 'recipeId')

export const recipesDuck = {
    ...recipesDuckRaw,
    ...recipesDuckRaw.optics
}
