import * as FSA from '@sha/fsa'
import * as R from 'ramda'
import {createCRUDDuck} from '@sha/fsa'

export type SessionVO = {
    sessionId?: string
    userId?: string
    email?: string
    ip?: string
    createdAt?: string
    updatedAt?: string
    connectionHeaders?: any
}

const duck = createCRUDDuck<SessionVO, 'sessionId'>('sessions', 'sessionId')

export const sessionsDuck = {
    ...duck
}
