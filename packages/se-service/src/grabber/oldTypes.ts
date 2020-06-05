import {createSchema, ExtractProps, Type} from 'ts-mongoose'
import {Action} from 'redux'

export const eventSchema = createSchema({
    timestamp: Type.number(),
    type: Type.string(),
    guid: Type.string(),
    payload: Type.mixed(),
})

export type EventObj = ExtractProps<typeof eventSchema> & Action<any>

export const alphaPromocode = {
    promocodeId: '1',
    activations: [
        {
            email: 'miramaxis@gmail.com',
            userId: 'be737105-09bc-41a1-a83a-2e00cd8a4980',
            timestamp: 1576237455386,
            info: {
                planId: '16297c70-165c-4bdd-85c2-aa07fe3940eb'
            }
        },
        {
            email: 'admin@smart-eat.ru',
            userId: 'smarteat',
            timestamp: 1576237574596,
            info: {
                planId: '57f7a06a-a77c-46b8-830b-3c15ed4920ae'
            }
        },
        {
            email: 'zauberin@inbox.ru',
            userId: 'cc9ca80b-b59a-47bd-b60c-fbf39638a813',
            timestamp: 1576500267995,
            info: {
                planId: 'fc987379-c6bd-42f2-9ae1-965647060e1e'
            }
        },
        {
            email: 'mirosenkovlad@gmail.com',
            userId: '364342c2-cc94-4d26-bad7-f3956bfd5f2a',
            timestamp: 1576576021579,
            info: {
                planId: '9675110c-1f0f-4ccc-a49d-6afbf04ce3b7'
            }
        },
        {
            email: 'nikitaphgp@mail.ru',
            userId: '87db1cde-2887-4574-a561-f3f7b6b6075d',
            timestamp: 1576583096624,
            info: {
                planId: '86366682-98ec-4b96-a72a-158c1a9b185c'
            }
        },
        {
            email: 'cool.skuratov2013@ya.ru',
            userId: '1613ce0c-870e-4e59-91f2-1767a0559c6b',
            timestamp: 1576587122356,
            info: {
                planId: '15b3fcf3-8500-41cf-abce-efc798841e1e'
            }
        },
        {
            email: 'mbychkovam@yandex.ru',
            userId: 'fe466437-1632-4483-8186-003a81762a35',
            timestamp: 1576601690153,
            info: {
                planId: 'f12ac71d-2117-4f54-b6c3-abc94414ca1d'
            }
        },
        {
            email: 'tanyagrid87@gmail.com',
            userId: '4cdebb08-dcbc-4134-b193-31ab1c5fe3e2',
            timestamp: 1576682898078,
            info: {
                planId: '47cd1f33-59c9-4806-b931-4e5be164687e'
            }
        },
        {
            email: 'yakut.arslangereeva@mail.ru',
            userId: '61f260ab-540b-49ae-9673-dd314f800848',
            timestamp: 1576690655755,
            info: {
                planId: '8f978156-b6fa-4384-b169-242e22f612d9'
            }
        },
        {
            email: 'mariem@rambler.ru',
            userId: '3abb160f-b3b0-4a2d-b570-662a0ff96230',
            timestamp: 1577031509072,
            info: {
                planId: '029d603a-f8e4-49f0-85b0-410832a83983'
            }
        },
        {
            email: 'igooge@me.com',
            userId: 'de689ca8-c78b-49f8-a17b-ded595b82b51',
            timestamp: 1577031751596,
            info: {
                planId: 'cfc18e33-292b-42c8-89be-15e90d388ee8'
            }
        },
        {
            email: 'yannna8096@yandex.ru',
            userId: '2d5e46e7-57fd-4339-9219-d050a97e59b2',
            timestamp: 1577082421150,
            info: {
                planId: '7aec0bb5-4528-4e85-8b0a-5eb18fa5563a'
            }
        },
        {
            email: 'dokadina@rambler.ru',
            userId: 'e5b4a9ea-3699-483d-9ce0-fe8eef96a188',
            timestamp: 1577089306188,
            info: {
                planId: 'e18aa185-cad4-4d1b-ae64-a4b4f4a185da'
            }
        },
        {
            email: 'kristinka_12.04@inbox.ru',
            userId: '300503a9-ff92-485a-b23b-f885b3afd497',
            timestamp: 1577093648181,
            info: {
                planId: '6ee40855-f6e2-452c-adc3-77b27cbef6d3'
            }
        },
        {
            email: 'vitunya51@gmail.com',
            userId: 'a0a2742a-6b71-4a7e-9067-a691d0a0812c',
            timestamp: 1577123459333,
            info: {
                planId: 'a986ff52-4014-4e89-9786-8e1ce61901c9'
            }
        },
        {
            email: 'lenachke2+5@list.ru',
            userId: 'a93d5508-115f-4f1d-8797-802d2f915ffd',
            timestamp: 1577138396972,
            info: {
                planId: '5ef4532b-c2ac-4896-9531-d03d88d8a43d'
            }
        },
        {
            email: 'miramaxis+7878@googlemail.com',
            userId: '7a36f9a8-efb3-4687-9201-a7e1f0b77af9',
            timestamp: 1578753623991,
            info: {
                planId: 'cccb00e1-6768-497e-bf8e-e004df7b9f97'
            }
        },
        {
            email: 'stasya_nesterova97@mail.ru',
            userId: '301623dd-88a8-4147-b332-9f82853432a7',
            timestamp: 1578982199053,
            info: {
                planId: 'c7b3d4ea-94ee-49d6-b3c7-8b9383eb4dde'
            }
        },
        {
            email: 'miramaxis+999999@gmail.com',
            userId: '0916cfd5-0c90-4eac-b192-7efa1ec30a35',
            timestamp: 1579092397971,
            info: {
                planId: '8813db92-90eb-470b-a787-688af506361f'
            }
        },
        {
            email: 'miramaxis+222@gmail.com',
            userId: '3c46163c-3939-4657-8af5-0e31a5a1e61c',
            timestamp: 1579101122686,
            info: {
                planId: 'd6f89259-fa00-4db3-ab1c-d42220c2e757'
            }
        },
        {
            email: 'iatskiv1987@mail.ru',
            userId: 'b8a87b32-97ce-41ea-bb01-70db3c9f95c6',
            timestamp: 1579149014344,
            info: {
                planId: '332e77f2-19c8-4193-a087-d5554dd742e3'
            }
        },
        {
            email: 'ant-85+21@mail.ru',
            userId: '73c7d9bd-0e90-4c0f-a35d-ed2c78799313',
            timestamp: 1580102835978,
            info: {
                planId: '0ed7d72e-b806-4960-ba29-d20a0c20bcb5'
            }
        },
        {
            email: 'chelobaka@bk.ru',
            userId: '20ce0ef0-c7dc-478c-9631-504aaa78bb46',
            timestamp: 1580330100074,
            info: {
                planId: 'fe5503ca-a394-4afe-b129-7554d2a65c91'
            }
        }
    ],
    promocodeString: 'mdYgj17sd',
    creationTimestamp: 1576212905960,
    expirationTimestamp: 1576805105960,
    forAllUsers: true,
    type: 'alphatest'
}



export type ProfileVO = {
    email?: string
    firstName?: string
    lastName?: string
    fullName?: string
    phone?: string
    name?: string

    gender: 0 | 1 // 'female' | 'male'
    age: number
    height: number
    weight: number
    lifestyle: 0 | 1 | 2 // no activity | 1 - 3 times per week | 3 -5 times per week
    goal: 0 | 1 | 2 // lose weight | stay same | increase the weight
    fitnessLevel?: 0 | 1 | 2 | 3
    workoutsPerWeek: number
    motherhood: number

    dailyPFC?: PFC
    ingredients: string[]
    cookingsPerWeek?:  0 | 1 | 2

}

type Dish = any

export type Day = {
    breakfast: Dish
    snack1: Dish
    snack2: Dish
    snack3: Dish
    supper: Dish
    dinner: Dish
}

export type Plan = {
    isExternal?: boolean
    planId: string
    userId: string
    profile: ProfileVO
    isPersonalPlan?: boolean
    scheme?: any
    days?: Day[]
    isPayed?: boolean
    isPayedByClient?: boolean
    orderTimestamp?: number
    orderInfo?: {

    }
    creationTimestamp: number

    planIsInvalid?: boolean
}


export type PFC = {
    p: number
    f: number
    c: number
}


export const asyncStatuses = ['started', 'done' , 'failed' , 'unset']
export type AsyncStatus = typeof asyncStatuses[number] //'started' | 'done' | 'failed' | 'unset'

export type PlanCustomDecorScheme =  {
    schemeName?: string
    fullName?: string
    website?: string
    phone?: string
    photo?: string
    instagram?: string
    extraInfo?: string
    hideContacts?: boolean
    bgSet?: 'default' | 'none' | 'brand'
} & PlanBrandDecorScheme

export type PlanBrandDecorScheme = {
    schemeName?: string
    coverBg?: string
    menuBg?: string
    recipesBg?: string
    instructionBg?: string
    shoppingListBg?: string
}

export type PlanDecorScheme = PlanBrandDecorScheme & PlanCustomDecorScheme

export type UserVO = {
    userId: string
    website?: string
    fullName: string
    firstName?: string
    lastName?: string
    email: string
    password: string
    phone?: string
    resetPasswordGuid?: string
    clientsType?: ClientType
    countryName?: string
    cityName?: string
    isTrainer: boolean
    banned: boolean
    balance: number
    registrationTimestamp: number
    emailIsConfirmed: boolean
    verifyDocs?: string[]
    verify?: AsyncStatus
    vk?: string
    instagram?: string
    referralLinkId?: string
    planDecor: {
        customSchemes: PlanCustomDecorScheme[]
        brandSchemes: PlanBrandDecorScheme[]
    },
    trainerData: {
        approveTimestamp: number
        backgroundImage: string
        description: string
        approved: AsyncStatus

        displayNames: DisplayNameAssign[]
    },
    transactions: any[]
    type: UserType
}

export type DisplayNameAssign = {
    value: string
    timestamp: number
}

export type ClientType = 'offline' | 'online'


export type UserType = 'personal' | 'trainer' | 'blogger' | 'clubOwner' | 'doctor' | 'other'

export type UserTypeOption = {
    label: string
    value: UserType
}

export const userTypes: UserTypeOption[] = [
    {
        label: 'Пользователь',
        value: 'personal',
    },
    {
        label: 'Тренер',
        value: 'trainer',
    },
    {
        label: 'Блогер',
        value: 'blogger',
    },
    {
        label: 'Представитель фитнес-клуба',
        value: 'clubOwner',
    },
    {
        label: 'Диетолог/Нутрицолог',
        value: 'doctor',
    },
    {
        label: 'Другое',
        value: 'other',
    },
]


export type SEBootstrap = {
        config: any,
        users: UserVO[],
        plans: Plan[],
        promoCodes: Array<typeof alphaPromocode>
}
