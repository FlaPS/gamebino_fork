import * as FSA from '@sha/fsa'
import {CredentialsVO} from 'se-iso/src/api'
import {UserVO} from 'se-iso/src/store/usersDuck'

const factory = FSA.actionCreatorFactory('trainersQuiz')

const actions = {
    getTrainersQuizByDisplayName: factory.async<{displayName: string}, UserVO>('getTrainersQuizByDisplayName')
}

const reducer = actions.getTrainersQuizByDisplayName.asyncReducer

export const trainersQuizDuck = {
    actions,
    factory,
    reducer,
}