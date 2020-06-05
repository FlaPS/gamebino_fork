import React from 'react'
import {IngredientVO, ingredientsDuck} from 'se-iso/src'
import StringInput from './inputs/StringInput'
import {ColumnProps} from 'antd/lib/table'
import DeleteCell from './DeleteCell'
import {Select, InputNumber, default as Ant} from 'antd'
import {useDispatch} from 'react-redux'
import {ExtractProps} from '@sha/react-fp'
import moment = require('moment')
import CheckboxInput from './inputs/CheckboxInput'
import {asLens, LensOrProp} from './asLens'
import {Lens} from 'monocle-ts'
import useConfig from '../../../se-mobile-front/src/hooks/useConfig'

type SortOrder = 'descend' | 'ascend'
const { Option } = Select




export const tableItemGetter = <T , V = any> (lensOrProp: LensOrProp<T, V>) => {
    let lens: Lens<T, V> = typeof lensOrProp === 'string' ? undefined : lensOrProp as any
    let prop: keyof T = typeof lensOrProp === 'string' ? lensOrProp : undefined
    return (obj: T) =>
        lens ? lens.get(obj) : (obj[prop] as any as V)
}

type UnaryFn<T, V> = (a: T) => V

export const arrPropSorter = <T  , V = any>(getOrProp: UnaryFn<T, V> | (keyof T) ) => {

    const get = getOrProp.hasOwnProperty('call')
                    ? getOrProp
                    // @ts-ignore
                    : (obj: T) => obj[getOrProp]



    return (a: T, b: T, sortOrder?: SortOrder) => {
        let A: V = get(a)
        let B: V = get(b)

        return A > B ? -1 : 1

    }
}

type Keys<T> = keyof T


export const checkSearch = <T = any> (props: LensOrProp<T>[]) => {
    const getters = props.map(tableItemGetter)
    return (search: string) =>
        (obj: T) => {
            if (!search || search.trim() === '')
                return true
            for (let i = 0; i < getters.length; i++) {
                const a = getters[i](obj)

                if (typeof a === 'string' || typeof a === 'number')
                    if (String(a).toLowerCase().includes(search.toLowerCase()))
                        return true
            }
            return false
        }
}




const EditableTagsCell = ({record, prop, options, actionCreator, ...props}: ExtractProps<Select> & {record, actionCreator, prop, options}) => {
    const lens = asLens(prop)
    const get = lens.get

    const dispatch = useDispatch()

    const onInputChange = (value) =>
        dispatch(actionCreator(lens.set(value), record))

    return  React.createElement(Select, {
        ...props,
        mode: 'tags',
        value: get(record),
        children: options,
        onChange: onInputChange,
        style: {width: '300px'},
        size: 'small',
    })
}

const EditableNumericCell = ({record, prop, actionCreator, ...props}: ExtractProps<InputNumber> & {record, actionCreator, prop}) => {
    const lens = asLens(prop)

    const dispatch = useDispatch()

    const onInputChange = (value) =>
        dispatch(actionCreator(lens.set(value)(record), record))
    return  React.createElement(InputNumber, {
        ...props,
        value: lens.get(record),
        onChange: onInputChange,
        style: {width: '50px'},
        size: 'small'
    })
}

export const createEditableTagsColumn = <T = any>(title, prop, actionCreator, options = [] as any[], props: ColumnProps<any> ={}) => (
    {
        // dataIndex: prop,
        title: title,
        sorter: arrPropSorter<T>(prop),
        render: (value, record: T) =>
            React.createElement(EditableTagsCell, {record, actionCreator, prop, options})
    }
)

export const createEditableNumericColumn = <T = any>(title, prop, actionCreator: Function, props: ColumnProps<any> ={}) => (
    {
        //dataIndex: asLens(prop).asFold(),
        title: title,
        sorter: arrPropSorter<T>(prop),
        render: (value, record) =>
            React.createElement(EditableNumericCell, {prop, record, actionCreator}),
        ...props,
    }
)

export const createEditableTextColumn = <T = any>(title, prop, actionCreator, props: ColumnProps<any> ={}) => (
    {
        //dataIndex: prop,
        title: title,
        sorter: arrPropSorter<T>(prop),
        render: (value, record) =>
            React.createElement(StringInput, {prop, record, actionCreator}),
        ...props,
    }
)

export const createDeleteCellColumn = <T = any>(title, prop, actionCreator, props: ColumnProps<any> ={}) => (
    {
        //dataIndex: prop,
        title: title,
        sorter: arrPropSorter<T>(prop),
        render: (value, record) =>
            React.createElement(DeleteCell, {prop, record, actionCreator}),
        ...props
    }
)




export const createDateColumn = <T>(title: string, prop: LensOrProp<T>, props: ColumnProps<any> ={}) => (
    {
        //dataIndex: prop,
        title: title,
        sorter: (a, b) =>
             a[prop] > b[prop] ? -1 : 1,

        render: (value, record) =>
            React.createElement(DateDisplay, {value, record, prop})
    }
)

const DateDisplay = ({value, record, prop}) => {
    const [config, utils] = useConfig()
    const val = asLens(prop).get(record)
    return val
        ? moment(val).format('DD-MM-YYYY HH:mm')
        : 'Неизвестно'
}

export type EditableCheckboxCellProps<T> = {

    record: T
    prop: LensOrProp<T>
    actionCreator: Function
    inverted?: boolean
}

const EditableCheckboxCell = <T>({record, prop, actionCreator, inverted}: EditableCheckboxCellProps<T>) => {
    const lens = asLens(prop)
    const dispatch = useDispatch()
    const onValueChange = React.useCallback(
        (value: boolean) =>
            dispatch(actionCreator(lens.set(value)(record), record)),
        [actionCreator, record, prop]
    )

    return  React.createElement(
        CheckboxInput,
        {
            value: Boolean(lens.get(record)) as any as boolean,
            onValueChange,
            inverted,
        }
    )
}


export const createEditableCheckboxColumn = <T>(
    title: string,
    prop: LensOrProp<T>,
    actionCreator: Function,
    inverted = false,
    props: ColumnProps<any> ={}) => (
    {
        //dataIndex: prop,
        title: title,
        sorter: arrPropSorter<T>(asLens(prop).get),
        render: (value, record: T) =>
            React.createElement(
                EditableCheckboxCell,
                {
                    record,
                    prop: prop as any,
                    actionCreator,
                    inverted
                }
            )
    }
)