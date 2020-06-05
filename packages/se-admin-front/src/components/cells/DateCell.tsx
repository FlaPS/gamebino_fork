import * as Ant from 'antd'
import React from 'react'

import {DuckInputProps, useDuckInput} from '../table/useDuckInput'
import useConfig from '../../../../se-mobile-front/src/hooks/useConfig'

import * as R from 'ramda'
import moment from 'moment'

const DateCell = <T,>(props: DuckInputProps<T, number>) => {
    const input = useDuckInput<T, number>(props)

    const value = moment(input.value).format("YYYY-MM-DDTHH:mm")

    console.log('Parse iso', input.value, ' as ', value)
    const [state, setState] = React.useState({value, focus:false})

    const onFocus = e => {
        setState({value: e.target.value, focus: true})
    }
    const onBlur = (e) => {
        const iso = new Date(state.value).toISOString()
        console.log('Dispatch iso date', iso)
        input.onValueChange(
            state.value
                ? iso
                : undefined
        )
    }
    const onChange = (e) => {
        setState({value: e.target.value, focus: state.focus})
    }

    return  <Ant.Input
                type='datetime-local'
                value={state.focus ? state.value : value}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
            >

            </Ant.Input>
}


export default DateCell
