import * as FSA from '@sha/fsa'
import {SEServiceConfig} from '../../../se-service/src/SEServiceConfig'
import {SEISOState} from '../SEISOState'

const factory = FSA.actionCreatorFactory('service')

const actions = {
    configUpdated: factory<Partial<SEServiceConfig>>('configUpdated')
}

const reducer = actions.configUpdated.payloadReducer

export const configDuck = {
    actions,
    factory,
    reducer,
    selectConfig: (state: SEISOState) =>
        state.app.bootstrap.config
}