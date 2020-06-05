import * as Ant from 'antd'
import React from 'react'
import {useDispatch} from 'react-redux'
import {DuckInputProps, useDuckInput} from '../table/useDuckInput'
import {InputNumberProps} from 'antd/lib/input-number'



const NumberCell = <T,>({record, property, ...props}: DuckInputProps<T, number> & Partial<InputNumberProps>) => {
    const {value, onValueChange} = useDuckInput({record, property})
    const [state, setState] = React.useState({value, focus:false})

    const onFocus = e => {
        setState({value: isNaN(Number(e.target.value)) ? '' : Number(e.target.value) , focus: true})
    }
    const onBlur = (e) => {
        const val = Number(state.value)
        onValueChange(isNaN(val) ? 0 : val)
    }
    const onChange = (e) => {
        setState({value: isNaN(Number(e)) ? e : Number(e), focus: state.focus})
    }


    return  <Ant.InputNumber
                {...props}
                value={state.focus ? state.value : value}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
            >

            </Ant.InputNumber>
}


export default NumberCell
