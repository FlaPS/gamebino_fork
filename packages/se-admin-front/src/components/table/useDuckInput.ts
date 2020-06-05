import {DuckColumnProps} from './basicColumn'
import {useDispatch} from 'react-redux'
import {DivProps} from '@sha/react-fp'

export type DuckInputProps<T, V> = {
    property: DuckColumnProps<T, V>
    record: T
} & DivProps

export const useDuckInput = <T, V>({property, record}: DuckInputProps<T, V>) => {
    const dispatch = useDispatch()
    if(!property)
        debugger
    return {
        value: property.get(record),
        onValueChange: (value) => {
            const newRecord = property.set(record)(value)
            const actionCreator = property.duck.actions.patched
            const event = actionCreator(newRecord, record)
            console.log('dispatch event', event)
            dispatch(event)
        }
    }
}