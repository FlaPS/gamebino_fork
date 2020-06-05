import {
    getDailyPFCWithoutGainers,
    ProfileVO
} from './ProfileVO'

export type ParamTarget = {
    min: number
    max: number
}


const mealPFCTargetsRawPercents = [
    // кал  	угл 	    Жиры 	    Белки
    [10, 35,	25,	40,	    8,	25,	    5,	25],
    [6,	 16,	10,	20,	    10,	15,	    5,	10],
    [20, 60,   28,	35,	    25,	25,	    18,	30],
    [8,	 15,	5,	35,	    14,	15,	    10,	18],
    [12, 23,	4,	15,	    20,	25,	    20,	25],
    [5,	 11,	4,	15,	    3,	5,	    3,	8 ],
]

export type MealTarget = {
    kcals: ParamTarget
    carbons: ParamTarget
    fats: ParamTarget
    proteins: ParamTarget
}

export type DailyTarget = {
    meals: MealTarget[]
    totalDaily: {
        kcals: number
        proteins: number
        fats: number
        carbons: number
    }
}




export const calculatePFCDailyTargets = (profile: ProfileVO): DailyTarget => {

    // map to decimals
    const targetsRaw = mealPFCTargetsRawPercents.map ( ar => ar.map ( value => value /100))
    const dailyPFC = getDailyPFCWithoutGainers(profile)
    const kcals = dailyPFC.k
    const proteins= dailyPFC.p
    const fats = dailyPFC.f
    const carbons =  dailyPFC.c//(kcals * (dailyPFC.c || 0.45)  / 4)
    return {
        meals: targetsRaw.map( ar =>
            ({
                kcals: {min: kcals * ar[0], max: kcals * ar[1]},
                carbons: {min: carbons * ar[2], max: ar[3] * carbons},
                fats: {min: fats * ar[4], max: ar[5] * fats},
                proteins: {min: proteins * ar[6], max: ar[7] * proteins},
            }),
        ),
        totalDaily: {
            kcals,
            proteins,
            fats,
            carbons,
        }
    }
}
