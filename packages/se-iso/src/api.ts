

import {getExampleLimits, IngredientVO, metaDuck, RecipePartVO, RecipeVO, SEBootstrap} from './store/'
import * as R from 'ramda'
import {DisplayNameAssign, UserVO} from './store/usersDuck'
import {generateGuid} from '@sha/random'
import {APIResponse} from './utils/asyncWorker'
import {ProfileVO} from './ProfileVO'
import {PlanVO} from './getPlanDigest'
import {Action} from 'redux'
import {PromoPurpose} from './store/promoCodesDuck'
import {WSFront} from './store/connection/WSFront'
import {SEISOConfig} from './SEISOConfig'
import {StoreMeta} from './store/metaDuck'


const randomImage = (width = 1000, height = 800) =>
    (index = Math.ceil(Math.random() * 800)) =>
        'https://picsum.photos/id/' + index + '/' + width + '/' + height


const smartEatTrainer: UserVO = {
    userId: "smarteat",
    password: 'smarteat',
    emailIsConfirmed: true,
    balance: 10000,
    type: 'trainer',
    transactions: [],
    fullName: 'Красавин Антон',
    banned: false,
    email: 'admin@smart-eat.ru',
    plans: [],
    isTrainer: true,
    registrationTimestamp: new Date().getTime(),
    trainerData: {
        displayNames: [{value: 'smarteat', timestamp: new Date().getTime()}],
        description: 'Основатель smart-eat.ru',
        approved: 'done',
        approveTimestamp: new Date().getTime(),
        backgroundImage: randomImage(800, 600)(),
        attachedDocks: R.times(randomImage(1000, 800), Math.round(Math.random() * 2) + 1),
    },
}

const profileMock = {"ingredients":["Гречка","Рис белый","Фасоль свежая/из банки","Горошек свежий/из банки","Белок","Кешью","Фундук","Чернослив","Инжир","Зелень","Чеснок","Груша","Банан","Мандарин","Апельсин","Соевый соус","Хрен сливочный","Масло олив.","Масло льняное","Масло сливочное","Протеиновое печенье","Протеиновый батончик","Протеиновое панкейки","Семечки подс.","Семечки тыкв."],"fullName":"Маша Машина","email":"mmmmm@mail.ru","phone":"+7 982 828 82 82","gender":0,"height":"170","weight":"65","age":"26","activityRate":1,"target":0}


interface TypedResponse<T = any> extends Response {
    /**
     * this will override `json` method from `Body` that is extended by `Response`
     * interface Body {
     *     json(): Promise<any>;
     * }
     */
    json<P = T>(): Promise<P>
}

export const usersMock: UserVO[] = [smartEatTrainer]


const pushedGuids = []
/**
 * Isomorphic api built on top of isomorphic axios
 * @param baseURL
 */
export const api = (state: {meta: StoreMeta, app: {config: SEISOConfig}} | any) => {

      const baseURL = '/api/v0.1'
      const meta = metaDuck.selectMeta(state)

      const handleResponse =
        async <T>(promise: Promise<TypedResponse<T>>, mapper: {(value: T): T} = (value: T) => value): APIResponse<T> => {
            try {
                const response = await promise
                let result = await response.json()

                if (result.error)
                    return {errors: [result]}

                // @ts-ignore
                result = result.result ? result.result: result

                // @ts-ignore
                result = mapper(result)

                return {result}
            } catch (e) {
                return {errors: e, result: undefined}
            }
        }

    const seHTTP2 = {
        post: <T> (url, payload): Promise<TypedResponse<T>> =>
            fetch(baseURL + url, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'X-Store-ID': meta.storeGuid,
                    'accept': 'application/json, text/plain, */*',
                    'content-type': 'application/json;charset=UTF-8',
                }
            })
    }


    return {
        /*
        fetchBootstrap: (): Promise<SEBootstrap> => {
            return new Promise( resolve => resolve({result: bootstrapMock}))
        },
        */

        fetchBootstrap: (payload: {pathname?: string, email?: string, password?: string}): Promise<SEBootstrap> =>
            // @ts-ignore
            handleResponse<any>(
                seHTTP2.post('/fetchBootstrap', payload)
            ),

        fetchAdminState: async (payload = {}): Promise<SEBootstrap> =>
            // @ts-ignore
            handleResponse<any>(
                seHTTP2.post('/fetchAdminState', payload)
            ),

        pushCommands: (events: []): Promise<boolean> =>
            handleResponse<boolean>(
                seHTTP2.post('/pushCommands', events.map( e => ({
                    ...e,
                    sourceUserId: meta.userId,
                    storeGuid: meta.storeGuid,
                })))
            ),

        isPromoAvailable: async (payload: {userId: string, promoCode: string}) =>
            await handleResponse<PromoPurpose>(
                seHTTP2.post('/isPromoAvailable', payload)
            ),

        signUp: (credentials: CredentialsVO): Promise<UserVO> =>
            handleResponse<CredentialsVO>(
                seHTTP2.post('/signUp', credentials)
            ),

        signIn: async (credentials: CredentialsVO): Promise<APIResponse<SEBootstrap>> =>
            handleResponse<UserVO>(
                seHTTP2.post('/signIn', credentials)
            ),

        getTrainerByDisplayName: ({displayName}): Promise<UserVO> =>
            handleResponse<UserVO>(
                seHTTP2.post('/getTrainerByDisplayName', {displayName})
            ),


        signOut: (): Promise<boolean> =>
            new Promise(resolve => resolve(true)),

        isEmailBusy: ({email}: {email: string}): Promise<boolean> =>
            handleResponse<boolean,boolean>(
                seHTTP2.post('/isEmailBusy', {email})
            ),
        checkEmail: ({email}: {email: string}): Promise<any> =>
            handleResponse<boolean,boolean>(
                seHTTP2.post('/checkEmail', {email})
            ),
        isDisplayNameBusy: async ({displayName}: {displayName: string}): Promise<any>  =>
            handleResponse<Boolean>(
                seHTTP2.post('/isDisplayNameBusy', {displayName})
            ),


        buyPlan: async (payload: {planId: string, promoCode?: string, userId?: string}) =>
            handleResponse<Action[]>(
                seHTTP2.post('/buyPlan', payload)
            ),


        register: async (payload: {user: UserVO, plan?: PlanVO}): Promise<any> =>
            handleResponse<any>(
                seHTTP2.post('/register', payload)
            ),

        resetPassword: async (payload: {email: string}): Promise<any> =>
            handleResponse<any>(
                seHTTP2.post('/resetPassword', payload)
            ),

        setPassword: async (payload: {password, resetPasswordGuid}) =>
            handleResponse<any>(
                seHTTP2.post('/setPassword', payload)
            ),

        getUserById: async (payload: {userId: string}) =>
            handleResponse<any>(
                seHTTP2.post('/getUserById', payload)
            ),

        campaignVisit: async (payload: {campaignCode: string}) =>
            handleResponse<any>(
                seHTTP2.post('/campaignVisit', payload)
            ),
    }
}

export type SignUpResponse = 'ok' | 'emailIsBusy'
export type SignInResponse = UserVO | 'wrongCredentials'

export type CredentialsVO = {
    email?: string
    password?: string
    remember?: boolean
}
/**
 * This type xported to be implemented by server side api, which matches the methods to the routes,
 * This api type could be used by mock api
 */
export type SERestApi = ReturnType<typeof api>
