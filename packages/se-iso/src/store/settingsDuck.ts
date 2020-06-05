import * as FSA from '@sha/fsa'

const factory = FSA.actionCreatorFactory('settings')


type DailyNutsTemplate = {

}
type ServiceSettings = {

}


export const actions = {
    reset: factory('reset'),
}

const reducer = actions.reset.