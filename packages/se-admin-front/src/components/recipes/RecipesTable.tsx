import {ColumnProps} from 'antd/lib/table'
import React from 'react'
import * as Ant from 'antd'
import * as R from 'ramda'
import moment from 'moment'
import { oc } from 'ts-optchain'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {IngredientVO, RecipeVO, RecipePartVO, recipesDuck} from 'se-iso/src'
import {AssociativeArray} from '@sha/utils'
import {arrPropSorter, createDeleteCellColumn, createEditableTextColumn} from '../tableUtils'

export class RecipesTable extends Ant.Table<RecipeVO> {
}



export const recipesColumns = {
    type: {
        dataIndex: 'recipeIndex',
        title: "Тип еды/ приоритет",
        sorter: arrPropSorter<RecipeVO>('recipeIndex'),
        render: (value: number, record: RecipeVO) => R.cond([
            [R.gt(200), R.always('Завтрак')],
            [R.gt(300), R.always('Перекус 1')],
            [R.gt(400), R.always('Обед')],
            [R.gt(500), R.always('Перекус 2')],
            [R.gt(600), R.always('Ужин')],
            [R.gt(700), R.always('Перед сном')],
            [R.T,       temp => temp]
        ])(value) + ' / ' + record.priority
    },
    index: createEditableTextColumn('Индекс', 'recipeIndex', recipesDuck.actions.updated.type),
    name: createEditableTextColumn('Комплекс', 'name', recipesDuck.actions.updated.type),

    list: {
        dataIndex: 'list',
        title: "Ингридиенты",
        width: 100,
        render: (value) => JSON.stringify(value)
    },
    removed: createDeleteCellColumn('' , 'recipeId', recipesDuck.actions.removed.type)

}

