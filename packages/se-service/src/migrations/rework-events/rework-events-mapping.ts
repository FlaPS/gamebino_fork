import {UserSchema, UserVO} from 'se-iso/src/store/usersDuck'
import * as R from 'ramda'
import * as T from '../../grabber/oldTypes'

export const mapUser = (source: T.UserVO): UserVO => {

    const {registrationTimestamp, ...rest} = source

    const result = {
        ...R.pick<T.UserVO, keyof UserVO>(Object.keys(UserSchema.definition) as any as UserVO, rest),
        createdAt: new Date(registrationTimestamp).toISOString(),
    }

    return result
}