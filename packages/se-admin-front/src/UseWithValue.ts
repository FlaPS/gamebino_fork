import React from 'react'
import { WithValueProps } from '@sha/fp'

const UseWithValue = <T>(initialValue?: T) => <P extends WithValueProps<T>>(
    Component: React.ComponentType<P>,
) =>
    (React.memo(({value, onValueChange, ...props}: P) => {
        const [valueFromHook, onValueChangeFromHook] = React.useState(
            value || initialValue,
        )

        if (value === initialValue) value = undefined

        const forwardProps = {
            ...props,
            value: value || valueFromHook,
            onValueChange: onValueChange || onValueChangeFromHook,
        }

        return React.createElement(
            Component,
            // @ts-ignore
            forwardProps,
        )
    }) as any) as React.FunctionComponent<P>

export default UseWithValue