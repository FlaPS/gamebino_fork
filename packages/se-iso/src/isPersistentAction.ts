import {FactoryAnyAction, isNamespace} from '@sha/fsa'
import {ingredientsDuck, plansDuck, recipesDuck} from './store'
import {usersDuck} from './store/usersDuck'
import {promoCodesDuck} from './store/promoCodesDuck'
import {AnyAction, Action} from 'redux'

export default (action: Action | FactoryAnyAction) => {
    const result = Boolean(action && action.meta && action.meta.persistent)
    console.log('Check action for persistence', result, action)
    return result
}
