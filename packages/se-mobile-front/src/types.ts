import React from 'react'

export type Head = 0 | 1

export type Tail = 0 | 1 | 2 | 3 | 4

export type Wire = [Head, Tail]

export type AbacusBoard = [
    Wire, Wire, Wire, Wire, Wire,
    Wire, Wire, Wire, Wire, Wire,
    Wire, Wire, Wire, Wire, Wire
]




type Fn1<T> = (props: T, ...a: any[]) => any

/**
 * Infer Props type by type of the component
 *
 * @example
 * type Props = ExtractProps<typeof Component>
 */
export type ExtractProps<TComponent> =
    TComponent extends React.ComponentType<infer TProps>
        ? TProps
        : TComponent extends Fn1<infer T>
        ? T
        : TComponent

export const makeComponent = <K extends keyof JSX.IntrinsicElements>(tag: K) =>
    (React.memo(
        React.forwardRef((props: JSX.IntrinsicElements[K], ref) =>
            React.createElement(tag, { ...props, ref }),
        ),
    ) as any) as React.ComponentClass<JSX.IntrinsicElements[K]>



export const G = makeComponent('g')

export type GProps = ExtractProps<typeof G>

export type OnValueChangeHandler<T> = (value: T) => any | void

export const defaultOnValueChange = value => undefined

export type WithValueProps<T> = {
    value?: T
    onValueChange?: OnValueChangeHandler<T>
}
