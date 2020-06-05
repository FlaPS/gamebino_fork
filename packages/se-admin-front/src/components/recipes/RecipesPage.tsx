import React from 'react'
import * as A from 'antd'
import * as R from 'ramda'
import {recipesColumns as cols, RecipesTable} from './RecipesTable'
import {IngredientVO, ingredientsDuck, RecipePartVO, recipesDuck, RecipeVO, getExampleLimits, Limit} from 'se-iso/src'
import {Action} from 'redux'
import {ColumnProps} from 'antd/lib/table'
import {useDispatch} from 'react-redux'
import {checkSearch, createEditableCheckboxColumn} from '../tableUtils'
import RecipeCard from './RecipeCard'

type RecipesPageProps = {
    data: RecipeVO[]
    ingredients: IngredientVO[]
    dispatch?: (action: Action) => any
    isPlan?: boolean
}
const {Search, TextArea} = A.Input
export const RecipesPage = ({data, ingredients, isPlan, dispatch}: RecipesPageProps) => {

    const ingredientOptions = ingredients.map ( i => <Option value={i.name} >{i.name}</Option>)
    const aliasOptions = R.uniq(
            R.flatten(ingredients
                    .map(i => i.replaceAliases)
            )
        )
        .filter( value => value !== undefined && value !== '')
        .map(value => <Option value={value} >{value}</Option>)

    const expandedRowRender = (record: RecipeVO, index: number, indent: number, expanded: boolean):  React.ReactNode => {
        return <RecipeCard
                ingredients={ingredients}
                recipe={record}
                aliasOptions={aliasOptions}
                ingredientOptions={ingredientOptions}
                dispatch={dispatch}
            />
    }

    const onAdd = () =>
        dispatch(recipesDuck.actions.added({name: 'Новое блюдо', list: []}))
    const [search, setSearch] = React.useState('')
    const filteredData = data.filter( checkSearch(['name', 'recipeIndex'])(search))

    const createCheckBoxCol = (name, prop, inverted = false) => ({
        dataIndex: prop,
        title: name,
        width: 40,
        render: (value, record: RecipeVO, index) => {
            return  (
                <A.Checkbox  checked={inverted ? !value : value} onChange={ (e) => {
                    if (dispatch) {
                        const value = inverted ? !e.target.checked : e.target.checked

                        dispatch(recipesDuck.actions.updated({
                            ...record,
                            [prop]: value
                        }))
                    }
                }} >

                </A.Checkbox>
            )
        }
    })

    return <div>
        <A.Row>
            <Search value={search} onChange={e => setSearch(e.target.value)} style={{width: '200px'}} />
        {dispatch &&
        <A.Button onClick={onAdd}>Добавить блюдо</A.Button>
        }</A.Row>
                <RecipesTable
                        size="small"
                        columns={[
                            cols.type,
                            cols.index,
                            cols.name,
                            createEditableCheckboxColumn(
                                'На похудение',
                                "excludeLosingWeight",
                                recipesDuck.actions.updated.type,
                                true,
                            ),
                            cols.removed,
                        ]}
                        dataSource={filteredData}
                        rowKey={"recipeId"}
                        expandedRowRender={expandedRowRender}
                    />
            </div>
}

