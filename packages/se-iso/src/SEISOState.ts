import {UserVO} from './store/usersDuck'
import {PlanVO} from './getPlanDigest'
import {IngredientVO, RecipeVO} from './store'
import {QuestionVO} from './store/quizDuck'
import {SEISOConfig} from './SEISOConfig'
import {StoreMeta} from './store/metaDuck'
import {AdminPreferences} from './store/localAdminPreferencesDuck'

export type SEISOState = {
    app: {
        bootstrap: {
            users: UserVO[]
            plans: PlanVO[]
            config: SEISOConfig,
            ingredients: IngredientVO[],
            recipes: RecipeVO[],
            quiz: QuestionVO[],
        },

    }
    meta: StoreMeta,
    adminPreferences: AdminPreferences,
}