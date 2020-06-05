import * as FSA from '@sha/fsa'
import * as R from 'ramda'
import {SEServiceConfig} from '../SEServiceConfig'
import {combineReducers} from 'redux'
import {usersDuck, UserVO} from 'se-iso/src/store/usersDuck'
import {
    campaignsDuck, CampaignVO, chatMessagesDuck, ChatMessageVO,
    configDuck,
    ingredientsDuck,
    IngredientVO,
    metaDuck,
    PlanVO,
    recipesDuck,
    RecipeVO,
} from 'se-iso/src'
import {plansDuck} from 'se-iso/src/store/plansDuck'
import {promoCodesDuck, PromoVO} from 'se-iso/src/store/promoCodesDuck'
import {QuestionVO, quizDuck} from 'se-iso/src/store/quizDuck'
import {defaultSEISOConfig} from 'se-iso/src/SEISOConfig'
import {StoreMeta} from 'se-iso/src/store/metaDuck'
import {sessionsDuck, SessionVO} from 'se-iso/src/store/sessionsDuck'

export const serviceDuck = {
    reducer: combineReducers({
        meta: metaDuck.reducer,
        app: combineReducers({
            bootstrap: combineReducers({
                config: configDuck.reducer,
                users: usersDuck.reducer,
                ingredients: ingredientsDuck.reducer,
                recipes: recipesDuck.reducer,
                quiz: quizDuck.reducer,
                plans: plansDuck.reducer,
                promoCodes: promoCodesDuck.reducer,
                sessions: sessionsDuck.reducer,
                campaigns: campaignsDuck.reducer,
                chatMessages: chatMessagesDuck.reducer,
            })
        })
    })
}

export type SEServiceState = {
    meta: StoreMeta,
    app: {
        bootstrap: {
            config: SEServiceConfig,
            users: UserVO[],
            ingredients: IngredientVO[],
            recipes: RecipeVO[],
            plans: PlanVO[],
            quiz: QuestionVO[],
            promoCodes: PromoVO[],
            sessions?: SessionVO[],
            campaigns?: CampaignVO[],
            chatMessages?: ChatMessageVO[],
        }
    }
}

const isoConfigKeys = R.keys(defaultSEISOConfig) as any as string[]

export const selectISOConfig = (state: SEServiceState) =>
    R.pick(isoConfigKeys, state.app.bootstrap.config)