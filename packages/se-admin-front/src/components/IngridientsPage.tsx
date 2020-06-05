import React from 'react'
import * as A from 'antd'
import IngredientsTable from './IngredientsTable'
import {IngredientVO, ingredientsDuck} from 'se-iso/src'
import {useDispatch} from 'react-redux'
import {checkSearch, createEditableTagsColumn, createEditableTextColumn} from './tableUtils'
import * as R from 'ramda'
import {SearchContext} from '../contexts'

const {Option} = A.Select

type IngredientsPageProps = {
    data: IngredientVO[]
}

const { Search } = A.Input

export const IngredientsPage = ({data}: IngredientsPageProps) => {

    const dispatch = useDispatch()

    const addIngredient = () => {
        dispatch(ingredientsDuck.actions.added({name: 'Новый игридиент'}))
    }

    const [search, setSearch] = React.useState('')
    const filteredData = data.filter(
        i =>
            checkSearch(['name'])(search)(i ) ||
            i.replaceAliases.filter(alias => alias.toLowerCase().startsWith(search.toLowerCase())).length
    )
    return <div>
            <A.Row>
                <Search value={search} onChange={e => setSearch(e.target.value)} style={{width: '200px'}} />
                <A.Button onClick={addIngredient}>
                Добавить ингридиент
                </A.Button>
            </A.Row>
            <SearchContext.Provider value={search} >
            <IngredientsTable data={filteredData} dispatch={dispatch}/>
            </SearchContext.Provider>
        </div>
}