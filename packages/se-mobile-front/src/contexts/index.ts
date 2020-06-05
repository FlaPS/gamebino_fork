import {createContext, useContext, Context} from 'react'
import { identity } from 'ramda'
import { now } from '@sha/utils'
import {getBrowserHistory} from '@sha/router'

const defaultValues = new Map<Context<any>, any>()

export const createAdvancedContext = <T>(defaultValue: T = undefined) => {
    const context = createContext(defaultValue)
    defaultValues.set(context, defaultValue)
    return Object.assign(context, {
        subscribe: <R = T>(selector: (value: T) => R = identity as any) =>
            useSubscribe(context, selector),
    })
}

export const useSubscribe = <T, R = T>(
    context: Context<T>,
    selector: (value: T) => R = identity as any,
) => {
    const value = useContext(context)
    return selector(value)
}

export const DisabledContext = createAdvancedContext(false)

export const NowContext = createAdvancedContext(now())

export const HistoryContext = createAdvancedContext(getBrowserHistory())

export const SearchContext = createAdvancedContext('')
