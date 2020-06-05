import React from 'react'
import * as Ant from 'antd'
import {useDispatch} from 'react-redux'

export type EditableTextCellProps = {
    record: any
    prop: string
    actionCreator: Function

}

const StringInput = ({record, prop, actionCreator}: EditableTextCellProps) => {
    const dispatch = useDispatch()
    const onInputChange = (value) =>
        dispatch(actionCreator({...record, [prop]: value}, record))
    return  <Ant.Input value={record[prop]} onChange={onInputChange} size='small'>

            </Ant.Input>
}


export default StringInput
