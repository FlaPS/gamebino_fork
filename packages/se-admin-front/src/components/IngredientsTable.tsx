import {ColumnProps} from 'antd/lib/table'
import React from 'react'
import * as Ant from 'antd'
import moment from 'moment'
import { oc } from 'ts-optchain'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {IngredientVO, ingredientsDuck, RecipePartVO, recipesDuck} from 'se-iso/src'
import * as R from 'ramda'
import {
    arrPropSorter,
    createDeleteCellColumn, createEditableCheckboxColumn,
    createEditableNumericColumn, createEditableTagsColumn,
    createEditableTextColumn
} from './tableUtils'
import StringInput from './inputs/StringInput'
import {ExtractProps} from '@sha/react-fp'
import {SearchContext} from '../contexts'
import {useDispatch} from 'react-redux'

class IngredientsTableRaw extends Ant.Table<IngredientVO> {
}

export const ingredientColumns = {
    name: createEditableTextColumn('Название ингридиента', 'name', ingredientsDuck.actions.updated.type),
    proteins: createEditableNumericColumn('Б', 'proteins', ingredientsDuck.actions.updated.type, {width: 100}),
    fats: createEditableNumericColumn('Ж', 'fats', ingredientsDuck.actions.updated.type, {width: 100}),
    carbons: createEditableNumericColumn('У', 'carbons', ingredientsDuck.actions.updated.type, {width: 100}),
    calories: createEditableNumericColumn('ККалл', 'calories', ingredientsDuck.actions.updated.type, {width: 100}),
    delete: createDeleteCellColumn('', 'ingredientId', ingredientsDuck.actions.removed.type, {width: 100}),
}

const {Option} = Ant.Select

export default ({data}: {data: IngredientVO[]}) => {
    const dispatch = useDispatch()
    const cols = ingredientColumns
    const aliasOptions = R.uniq(
                R.flatten(
                    data.map( i => i.replaceAliases)
                )
            )
            .map ( text =>
                <Option key={text} value={text}>{text}</Option>
            )

    return   <IngredientsTableRaw
                size="small"
                columns={[
                    cols.name,
                    cols.proteins,
                    cols.fats,
                    cols.carbons,
                    cols.calories,
                    createEditableTagsColumn(
                        'Заменитель',
                        'replaceAliases',
                        ingredientsDuck.actions.updated.type,
                        aliasOptions ,
                        {width: 300}
                    ),
                    createEditableNumericColumn(
                        'Цена деления',
                        'minimumDivision',
                        ingredientsDuck.actions.updated.type,
                    ),
                    createEditableCheckboxColumn<IngredientVO>(
                        'На похудение',
                        'excludeLosingWeight',
                        ingredientsDuck.actions.updated.type,
                        true,
                        {
                            width: 40
                        }
                    ),
                    cols.delete,
                ]}
                dataSource={data}
            />
}