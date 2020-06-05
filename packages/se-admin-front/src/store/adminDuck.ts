import {combineReducers} from 'redux'
import {uiDuck} from '../../../se-mobile-front/src/store/uiDuck'
import {ingredientsDuck} from 'se-iso/src/store/ingredientsDuck'
import {recipesDuck} from 'se-iso/src/store/recepiesDuck'
import {usersDuck, actions, UserVO} from 'se-iso/src/store/usersDuck'
import {plansDuck} from 'se-iso/src/store/plansDuck'
import {quizDuck} from 'se-iso/src/store/quizDuck'
import { promoCodesDuck } from 'se-iso/src/store/promoCodesDuck'
import {campaignsDuck, chatMessagesDuck, configDuck, connectionDuck} from 'se-iso/src'
import {sessionsDuck} from 'se-iso/src/store/sessionsDuck'

const combined = combineReducers({
    bootstrap: combineReducers({
        users: usersDuck.reducer,
        ingredients: ingredientsDuck.reducer,
        recipes: recipesDuck.reducer,
        plans: plansDuck.reducer,
        quiz: quizDuck.reducer,
        promoCodes: promoCodesDuck.reducer,
        config: configDuck.reducer,
        sessions: sessionsDuck.reducer,

        campaigns: campaignsDuck.reducer,
        chatMessages: chatMessagesDuck.reducer,
    }),
    ui: uiDuck.reducer,
    conn: connectionDuck.reducer,
})

export const adminDuck = {
    reducer: combined,
}