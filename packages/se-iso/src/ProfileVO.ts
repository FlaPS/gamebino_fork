import * as R from 'ramda'

type Option<T = number> = {
    label: string,
    value: T,
}

export const goalOptions: Option[] = [
    {
        label: "Похудеть (убрать жир)",
        value: 0
    },
    {
        label: "Поддерживать свою форму",
        value: 1
    },
    {
        label: "Набрать мышечную массу",
        value: 2
    },
]

export const lifestyleOptions: Option<number>[] = [
    {
        label: "Сидячая работа, малоподвижный образ жизни",
        value: 1.3
    },
    {
        label: "Сидячая работа, среднеактивный образ жизни\n",
        value: 1.35
    },
    {
        label: "Работа связана с физической нагрузкой, очень активный образ жизни",
        value: 1.4
    },
]

export const fitnessLevelOptions: Option<number[]>[] = [
    {
        label: "Новичок",
        value: [0.71,	1,	1.15]
    },
    {
        label: "Тренированный (регулярные занятия спортом более 2 раз в неделю больше года)",
        value: [0.72,	1,	1.2]
    },
    {
        label: "Спортсмен-любитель (регулярные занятия спортом более 4ех раз в неделю больее 3ех лет)",
        value: [0.75,	1,	1.23]
    },
    {
        label: "Спортсмен",
        value: [0.8,	1,	1.25]
    },
]

export const motherhoodOptions: Option<{p: number, f: number, c: number}>[] = [
    {
        label: 'Не беременна/не кормящая',
        value: {p: 0, f: 0, c: 0},
    },
    {
        label: 'Беременная',
        value: {p: 30, f: 12, c: 30},
    },
    {
        label: 'Кормление 1-6 месяц',
        value: {p: 50, f: 15, c: 40},
    },
    {
        label: 'Кормление 7-12 месяц',
        value: {p: 50, f: 15, c: 30},
    },
]

export const workoutOptions: Option<number>[] = R.times( index => ({
            label: index.toString(),
            value: index
        }),
        21,
    )



// БЖУ от КФА <1.39, <1.54, <10
export const kfaNuts = [
    [
        [0.21,	0.37,	0.42,],
       [ 0.23,	0.35,	0.42,],
        [0.23,	0.33,	0.44,],
    ],
    [
       [ 0.14,	0.32,	0.54,],
       [ 0.15,	0.3,	0.55,],
        [0.17,	0.27,	0.56,],
    ],
    [
        [0.2,	0.25,	0.55,],
        [0.2,	0.23,	0.57,],
        [0.18,	0.23,	0.59,],
    ]
]


export const getProfileKFA = (profile: ProfileVO): number => {
    return lifestyleOptions[profile.lifestyle || 0].value + (profile.workoutsPerWeek || 0) * 0.05
}

export const getProfileBasicKCals = (profile: ProfileVO): number => {
    // константа:	для женщин = - 161 (минус 161) для мужчин = + 5 (плюс 5)
    const genderConst = profile.gender ? 5 : -161

    //  БОО (Базовый обмен веществ)	=9,99*вес+6,25*рост-4,92*возраст + константа
    const basicValue = 9.99 * profile.weight + 6.25 * profile.height - 4.92 * profile.age + genderConst
    return basicValue
}


export const getProfileDailyTotalConsuptionKCals = (profile: ProfileVO): number => {
    const basicValue = getProfileBasicKCals(profile)
    //  +СДДП (специфическое динамическое действие пищи)	=БОО*0,125
    const specDynamic = basicValue * 0.125

    // ОСЭ (общее суточное потребление)	=БОО*КФА+СДДП

    const totalDailyConsumption = basicValue * getProfileKFA(profile) + specDynamic
    return totalDailyConsumption
}

const gainer = {
    p: 15.0,
    f: 1.3,
    c: 75.4,
    k : 373.3
}

const proteinsWithJuice = {
    p: 79,
    f: 3	,
    c: 82,
    k: 683
}

export const getDailyGainersGramms = (profile: ProfileVO) => {
    const useGainers = profile.goal !== 0 && profile.ingredients.includes('Гейнер')
    const targetK = pfcToK(getProfileFinalPFC(profile))
    const gainerK = targetK * 0.15
    const gainerGramms =  Math.max(Math.round(gainerK / gainer.k  * 100 / 50) * 50, 50)

    return useGainers ? gainerGramms : 0

}



export const getDailyProteinsWithJuiceGramms = (profile: ProfileVO) => {
    const useProteins = profile.goal !== 0 && profile.ingredients.includes('Протеин и сок')
    return useProteins ? 33 : 0
}

const drinks: Array<PFC & { name: string }>= [
    {
        name: 'Латте/Капучино',
        p: 6,
        f: 7,
        c: 10,
    },
    {
        name: 'Кофе/чай с молоком и сахаром',
        p: 3,
        f: 2.5,
        c: 14.6,
    },

    {
        name: 'Кофе/чай с молоком',
        p: 3,
        f: 2.5,
        c: 4.7,
    },
    {
        name: 'Кофе/чай с сахаром',
        p: 0,
        f: 0,
        c: 9.9,
    },


]

export const getDailyDrinksPFC = (profile: ProfileVO) => {
    if (profile.goal !== 0)

        return {
            p: 0,
            f: 0,
            c: 0,
            name: 'Без напитков'
        }

    if(profile.ingredients.includes(drinks[0].name))
        return drinks[0]
    if(profile.ingredients.includes(drinks[1].name))
        return drinks[1]
    if(profile.ingredients.includes(drinks[2].name))
        return drinks[2]
    if(profile.ingredients.includes(drinks[3].name))
        return drinks[3]

    return {
        p: 0,
        f: 0,
        c: 0,
        name: 'Без напитков'
    }
}



export const getDailyPFCWithoutGainers = (profile: ProfileVO) => {
    let {p, f, c} = getProfileFinalPFC(profile)
    let gainerGramms = getDailyGainersGramms(profile)
    let proteinsGramms = getDailyProteinsWithJuiceGramms(profile)
    let drinkPFC = getDailyDrinksPFC(profile)
    const result = {
        p: p - gainer.p / 100 * gainerGramms - proteinsWithJuice.p / 100 * proteinsGramms - drinkPFC.p,
        f: f - gainer.f / 100 * gainerGramms - proteinsWithJuice.f / 100 * proteinsGramms - drinkPFC.f,
        c: c - gainer.c / 100 * gainerGramms - proteinsWithJuice.c / 100 * proteinsGramms - drinkPFC.c,
    }
    return {
        ...result,
        k : pfcToK(result),
    }
}
export const getDailyKCalsWithutGainers = (profile: ProfileVO) =>
    getDailyPFCWithoutGainers(profile).k

export const getProfileDefaultTargetKCals = (profile: ProfileVO, excludeGainers = true): number => {

    const overallScore = getProfileDailyTotalConsuptionKCals(profile)
        * fitnessLevelOptions[profile.fitnessLevel || 0]
            .value[profile.goal || 0]

    // ИТОГОВАЯ КАЛОРИЙНОСТЬ	= ОСЭ*Цель
    return Math.ceil(overallScore) //* targteFactors[profile.target])
}

export const debugProfileDefaultTargtes = (profile: ProfileVO) => {

    const targetPFC = getProfileTargetPFC(profile)
    return {
        basicConsumption: getProfileBasicKCals(profile),
        totalConsumption: getProfileDailyTotalConsuptionKCals(profile),
        targetConsumption: getProfileDefaultTargetKCals(profile),
        targetPFC,
        kfa: getProfileKFA(profile),
        targetKCals: targetPFC.p * 4 + targetPFC.f * 9 + targetPFC.c * 4
    }
}


import {createSchema, Extract, ExtractProps, Type, typedModel} from 'ts-mongoose'

export type PFC = Omit<ExtractProps<typeof PFCSchema>, '_id' | '__v'>

const subPFC = (pfc1, pfc2, factor = 1): PFC =>
    ({
        p: pfc1.p - pfc2.p * factor,
        f: pfc1.f - pfc2.f * factor,
        c: pfc1.c - pfc2.c * factor,
    })
export const PFCSchema = createSchema({
    p: Type.number({required: true}),
    f: Type.number({required: true}),
    c: Type.number({required: true}),
})

export const pfcToK = ({p,f,c}: PFC) =>
    p * 4 + f * 9 + c * 4

export const getProfileTargetPFC = (profile: ProfileVO) => {
    const kcals = getProfileDefaultTargetKCals(profile)
    const kfa = getProfileKFA(profile)

    let kfaType = 2
    if(kfa < 1.39)
        kfaType = 0
    else if (kfa < 1.54)
        kfaType = 1

    const [pPart,fPart,cPart] =  kfaNuts[profile.goal||0][kfaType||0]
    const proteins= (kcals * (pPart)  / 4)
    const fats =    (kcals * (fPart)  / 9)
    const carbons = (kcals * (cPart)  / 4)

    let pfc =  {
        p: proteins ,
        f: fats ,
        c: carbons ,
    }
    if (profile.gender === 0)

    pfc = {
        p: pfc.p + motherhoodOptions[profile.motherhood || 0].value.p,
        f: pfc.f + motherhoodOptions[profile.motherhood || 0].value.f,
        c: pfc.c + motherhoodOptions[profile.motherhood || 0].value.c,
    }

    return pfc
}

export const getProfileFinalPFC = (profile: ProfileVO) => {

    return profile.dailyPFC ? profile.dailyPFC : getProfileTargetPFC(profile)
}

export const getProfileTargetKCals = (profile: ProfileVO) => {
    const dailyPFC = getProfileFinalPFC(profile)
    return dailyPFC.p * 4 + dailyPFC.f * 9 + dailyPFC.c * 4
}

const genders = [0,1,2] as const

export const ProfileSchema = createSchema({
    fullName: Type.string({trim: true}),
    phone: Type.string({trim: true}),
    email: Type.string({trim: true, toLowerCase: true}),
    gender: Type.number({min: 0, max: 1 }),
    age: Type.number({min: 0, max: 120}),
    ingredients: Type.array().of(Type.string()),
    height: Type.number(),
    weight: Type.number(),
    lifestyle: Type.number({min: 0, max: 2}),
    goal: Type.number({min: 0, max: 2}),
    cookingsPerWeek: Type.number({min: 0, max: 2}),
    fitnessLevel: Type.number({min: 0, max: 3}),
    motherhood: Type.number({min: 0, max: 3}),
    workoutsPerWeek: Type.number({min:0, max: 25}),

    dailyPFC: Type.object().of({
        p: Type.number(),
        f: Type.number(),
        c: Type.number(),
    }),
}, {strict: false, versionKey: false, _id: false, id: false})


export type ProfileVO  = ExtractProps<typeof ProfileSchema>
const p: ProfileVO = {}


export const getDefaultProfile = (): ProfileVO => ({
    height: 175,
    weight: 68,
    age: 30,
    lifestyle: 0,
    goal: 1,
    motherhood: 0,
    cookingsPerWeek: 0,
    ingredients: [],
    workoutsPerWeek: 0,
    fitnessLevel: 0,
    fullName: 'Имя Фамилия',
    gender: 1,

})
