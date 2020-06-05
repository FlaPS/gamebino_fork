import {Duck} from './basicColumn'
import {ColumnProps} from 'antd/lib/table'
import DeleteCell, {DeleteCellProps} from '../DeleteCell'
import React from 'react'

export default (duck: Duck): ColumnProps<any> => ({
        render: (value, record, index) =>
            <DeleteCell record={record} duck={duck}/>
    }
)