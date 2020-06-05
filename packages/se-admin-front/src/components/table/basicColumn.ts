import * as R from 'ramda'
import React from 'react'
import {ColumnProps} from 'antd/lib/table'
import {CompareFn} from 'antd/lib/table/interface'
import {createCRUDDuck} from '../../../../fsa/src'
import {DuckInputProps} from './useDuckInput'
import {DivProps} from '@sha/react-fp'


export type Duck = ReturnType<typeof createCRUDDuck>

export type DuckProperty<T, V = any>  = {
    dataIndex?: string
    set?: (record: T) => (value: V) => any
    get?: (record: T) => V
    duck?: Duck
    editable?: boolean
    title?: string
}

export const duckProperty = <T, V = any> (props: DuckProperty<T, V>) => {
    const way = props.dataIndex ? props.dataIndex.split('.') : undefined

    const get = way
        ? (record: T): V =>
            R.path(way, record) as V
        : undefined

    const set = way
        ? (record: T) => (value: V) => {
            const result = R.assocPath(way)(value)(record)

            return result
        }
        : undefined

    return {
        ...props,
        get,
        set,
    }
}



export type DuckColumnProps<T, V = any> = DuckProperty<T, V> & {
    sorter?: boolean | CompareFn<T>
    cell?: React.ComponentType<DuckInputProps<T, V>>
    render?: (text: any, record: T, index: number) => React.ReactNode
    width?: string | number
    cellProps?: DivProps
}




export default <T, V = string>(props: DuckColumnProps<T, V>) => {

    props = duckProperty(props)

    const sorter = props.get
        ? (a: T, b: T) => {
            let A = props.get(a)
            let B = props.get(b)

            if(typeof A === 'string' || typeof B === 'string')
                return ((A ||'') as any as string).localeCompare(((B || '') as any as string))

            return A > B ? -1 : 1
        }
        : false

    const CellComp = props.cell
    const render = CellComp
        ? (value, record, index) =>
            React.createElement(CellComp, {property: resultColumn, record, ...props.cellProps})
        : undefined
    const defaultBasicColumnProps: Partial<DuckColumnProps<T, V>> = {
        ...props,
        sorter,
        dataIndex: props.dataIndex,
        render,
    }

    const resultColumn = {
        ...defaultBasicColumnProps,
        ...props
    }

    return resultColumn
}