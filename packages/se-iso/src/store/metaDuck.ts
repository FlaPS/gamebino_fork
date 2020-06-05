import * as fsa from '@sha/fsa'
import {generateGuid} from '@sha/random'
import {FactoryAnyAction} from '@sha/fsa'

const factory = fsa.actionCreatorFactory('meta')

const defaultMeta = {
    storeGuid: generateGuid(),
    userId: 'service',
}

export type StoreMeta = typeof defaultMeta

const actions = {
    metaUpdated: factory<Partial<StoreMeta>>('metaUpdated')
}


const reducer = (state = defaultMeta, action: FactoryAnyAction ) => {
    if(actions.metaUpdated.isType(action))
        return {...state, ...action.payload}
    return state
}

export default {
    reducer,
    actions,
    factory,
    selectMeta: (state: {meta: StoreMeta}) => state.meta
}