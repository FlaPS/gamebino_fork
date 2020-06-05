import * as Ant from 'antd'
import React from 'react'
import {DuckInputProps, useDuckInput} from '../table/useDuckInput'
import {usePrevious} from 'react-use'



const StringCell = <T,>({record, property, ...props}: DuckInputProps<T, string>) => {
    const {value, onValueChange} = useDuckInput({record, property})

    const previous = usePrevious(value)

    const [state, setState] = React.useState({value, focus:false, changed: false})

    //const previousValue = usePrevious(value)

    /*if(previousValue !== value)
        setState(value)
    */
    const onFocus = e => {
        setState({value: e.target.value, focus: true, changed: false})
    }
    const onBlur = (e) => {
        if(state.changed)
            onValueChange(state.value)
    }
    const onChange = (e) => {
        setState({value: e.target.value, focus: state.focus, changed: true})
    }


    return  <Ant.Input
                    {...props}
                    value={state.focus ? state.value : value}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={onChange}
            >

            </Ant.Input>
}


export default StringCell
