import React from 'react'
import * as Ant from 'antd'
import {useDispatch} from 'react-redux'
import {Duck} from './table/basicColumn'



export type DeleteCellProps = {
    duck?: Duck
    record: any
    prop?: string
    actionCreator?: Function
}

const DeleteCell = ({duck, record, prop, actionCreator}: DeleteCellProps) => {
    const dispatch = useDispatch()
    const onDelete = (e) =>
        duck
            ? dispatch(duck.actions.removed(record[duck.idKey]))
            :dispatch(actionCreator(record[prop]))

    return     <Ant.Popconfirm title="Уверены что хотите удалить?" onConfirm={onDelete} okText={'Да'} cancelText={'Отмена'}>
                    <a>Удалить</a>
                </Ant.Popconfirm>
}

export default DeleteCell


