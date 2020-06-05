import {Lens} from 'monocle-ts'
type Keys<T> = keyof T
export type LensOrProp<T, V = any> =  Lens<T, V> | Keys<T>

export const asLens = <T, V = any>(lensOrProp: LensOrProp<T, V> | Keys<T>): Lens<T, V> =>
    // @ts-ignore
    (
        typeof lensOrProp === 'string' ||
        typeof lensOrProp === 'number' ||
        typeof lensOrProp === 'symbol'
    )
        ? Lens.fromProp<T>()(lensOrProp)
        : lensOrProp
