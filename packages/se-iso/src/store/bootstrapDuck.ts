import * as fsa from '@sha/fsa'
import {ingredientsDuck, IngredientVO} from './ingredientsDuck'
import {recipesDuck, RecipeVO} from './recepiesDuck'
import {QuestionVO, quizDuck} from './quizDuck'
import {usersDuck, UserVO} from './usersDuck'
import {combineReducers, Reducer} from 'redux'
import {plansDuck} from './plansDuck'
import {PlanVO} from '../getPlanDigest'
import {SEServiceConfig} from '../../../se-service/src/SEServiceConfig'
import {configDuck} from './configDuck'
import {promoCodesDuck, PromoVO} from './promoCodesDuck'
import {AsyncState, Success} from '@sha/fsa'
import {SignInDonePayload} from '../../../se-mobile-front/src/store/loginDuck'
import {SEISOState} from '../SEISOState'
import {sessionsDuck, SessionVO} from './sessionsDuck'
import {campaignsDuck, CampaignVO} from './campaignsDuck'
import {chatMessagesDuck, ChatMessageVO} from './chatMessagesDuck'



const factory = fsa.actionCreatorFactory('bootstrap')

const actions = {
    fetchBootstrap: factory.async<undefined,SEBootstrap & SignInDonePayload>('fetchBootstrap')
}

const reducer = combineReducers({
    users: usersDuck.reducer,
    plans: plansDuck.reducer,
    quiz: quizDuck.reducer,
    ingredients: ingredientsDuck.reducer,
    recipes: recipesDuck.reducer,
    config: configDuck.reducer,
    promoCodes: promoCodesDuck.reducer,
    sessions: sessionsDuck.reducer,
    campaigns: campaignsDuck.reducer,
    chatMessages: chatMessagesDuck.reducer
}) as Reducer<SEBootstrap>

export type SEBootstrap = {
    users: UserVO[]
    plans: PlanVO[]
    quiz: QuestionVO[]
    ingredients: IngredientVO[]
    recipes: RecipeVO[]
    config: SEServiceConfig
    promoCodes: PromoVO[]
    sessions?: SessionVO[]
    campaigns?: CampaignVO[]
    chatMessages?: ChatMessageVO[]
}

export const bootstrapDuck = {
    reducer,
    factory,
    actions,
    selectBootstrap: (state: SEISOState) =>
        state.app.bootstrap
}