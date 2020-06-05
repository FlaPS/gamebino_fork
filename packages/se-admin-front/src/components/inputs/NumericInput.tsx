import React, {useContext} from 'react'
import {InputNumber} from 'antd'
import {ExtractProps, onChangeHandler, WithValueProps} from '@sha/react-fp'
import {DisabledContext} from '../../contexts'

export type NumericInputProps = WithValueProps<number> & ExtractProps<InputNumber>
// @ts-ignore
const NumericInput = ({value, onValueChange, onChange, ...props}: NumericInputProps) =>
    <InputNumber
        {...props}
        disabled={useContext(DisabledContext)}
        value={value}
        onChange={(e) => {
            if (onChange) onChange(e)
            if (onValueChange) onValueChange(e)
        }
    }/>

export default NumericInput
