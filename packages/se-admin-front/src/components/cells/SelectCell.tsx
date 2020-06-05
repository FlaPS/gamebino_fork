import * as Ant from 'antd'
import React from 'react'
import {DuckInputProps, useDuckInput} from '../table/useDuckInput'
import {SelectProps} from 'antd/lib/select'



const SelectCell = <T, V = string>({property, record, ...props}: DuckInputProps<T, V> & SelectProps<V> & {children}) => {
    const {value, onValueChange} = useDuckInput({property, record})

    return  <Ant.Select<V>
                allowClear={false}
                {...props}
                value={value as any as V}
                onChange={onValueChange}

            />
}


export default SelectCell