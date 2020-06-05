import * as FSA from '@sha/fsa'

export type QuestionVO = {
    questionId: number
    title: string
    minChecks: number
    goals: number[]
}

const duck =  FSA.createCRUDDuck<QuestionVO, 'questionId'>('quiz', 'questionId')

export const quizDuck = {
    ...duck,
    ...duck.optics,
}
