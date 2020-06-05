import React from 'react'
import { Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import * as A from 'antd'
import * as R from 'ramda'
import {getExampleLimits, ingredientsDuck, Limit, RecipePartVO, recipesDuck, RecipeVO} from 'se-iso/src'
const { Option } = Select

const RecipeCard = ({recipe,  ingredients, dispatch}: {recipe: RecipeVO, dispatch?} & any) => {
    const listLens = R.lensProp('list')
    const ingredientOptions = ingredients.map ( i => <Option value={i.name} >{i.name}</Option>)
    const aliasOptions = R.uniq(
        R.flatten(ingredients
            .map(i => i.replaceAliases)
        )
    )
        .filter( value => value !== undefined && value !== '')
        .map(value => <Option value={value} >{value}</Option>)

    const getPropLens = (index, prop) =>
        R.compose(listLens, R.lensIndex(index), R.lensProp(prop)) as any as R.Lens

    const onDelete = (index) => {
        dispatch(recipesDuck.actions.updated({
            ...recipe,
            list: R.removed(index, 1, recipe.list)
        }))
    }

    const onAdd = () =>
        dispatch(recipesDuck.actions.updated({
            ...recipe,
            list: [...recipe.list, {
                exampleWeight: 100,
                limit: getExampleLimits(100).kcals,
                sourceType: 'kcals',
            }]
        }))

    const createCheckBoxCol = (name, prop, inverted = false) => ({
        dataIndex: prop,
        title: name,
        width: 40,
        render: (value, record: RecipePartVO, index) => {
            return  (
                <A.Checkbox  checked={inverted ? !value : value} onChange={ (e) => {
                    if (dispatch) {
                        const value = inverted ? !e.target.checked : e.target.checked
                        const newRecipe = R.set(getPropLens(index, prop), value, recipe)
                        dispatch(recipesDuck.actions.updated(newRecipe))
                    }
                }} >

                </A.Checkbox>
            )
        }
    })


    const cols = [
        createCheckBoxCol('Заменитель', 'isAlias'),
        createCheckBoxCol('Обязательно', "required"),
        {
            dataIndex: 'name',
            title: 'Ингридиент',
            width: 230,
            render: (value, record: RecipePartVO, index) => {
                const node = record.isAlias
                    ?
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Выберите заменитель"
                        optionFilterProp="children"
                        disabled={dispatch === undefined}
                        onChange={(value) => {
                            const newRecipe = R.set(getPropLens(index, 'name'), value, recipe)
                            dispatch(recipesDuck.actions.updated(newRecipe))
                        }}
                        value={record.name}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >

                        {aliasOptions}
                    </Select>
                    : <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Выберите ингридинет"
                        optionFilterProp="children"
                        disabled={dispatch === undefined}
                        onChange={(value) => {
                            const newRecipe = R.set(getPropLens(index, 'name'), value, recipe)
                            dispatch(recipesDuck.actions.updated(newRecipe))
                        }}
                        value={record.name}
                        filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >

                        {ingredientOptions}
                    </Select>
                return node
            }
        },
        {
            dataIndex: 'exampleWeight',
            title: 'вес',
            width: 60,
            render: (value, record, index) =>{
                const onInputChange = (e) => {
                    const newRecipe = R.set(getPropLens(index, 'exampleWeight'), Number(e.target.value), recipe)
                    dispatch(recipesDuck.actions.updated(newRecipe))
                }

                return  <A.Input value={value} onChange={onInputChange}>

                </A.Input>
            }
        },
        {
            dataIndex: 'sourceType',
            title: 'Источник',
            width: 100,
            render: (value, record: RecipePartVO, index) => {
                return <Select
                    value={value}
                    onChange={(value) => {
                        let newRecipe = R.set(getPropLens(index, 'sourceType'), value, recipe)
                        const limits = getExampleLimits(record.exampleWeight)[value]
                        newRecipe = R.set(getPropLens(index, 'limits'), limits, newRecipe)
                        dispatch(recipesDuck.actions.updated(newRecipe))
                    }}
                >
                    <Option value={'kcals'}>N/A</Option>
                    <Option value={'proteins'}>белки</Option>
                    <Option value={'fats'}>Жиры</Option>
                    <Option value={'carbons'}>Углеводы</Option>
                </Select>
            }
        },
        {
            dataIndex: 'limits',
            title: 'Макс. вес',
            render: (value: Limit[], record: RecipePartVO, index) =>{
                const onInputChange = (e) => {
                    let newValue = value
                    try {
                        newValue = JSON.parse(e.target.value)
                        const newRecipe = R.set(getPropLens(index, 'limits'), newValue, recipe)
                        dispatch(recipesDuck.actions.updated(newRecipe))
                    } catch(e) {

                    }
                }

                return  <TextArea
                    defaultValue={JSON.stringify(value)}
                    onChange={onInputChange}
                    placeholder=""
                    autoSize={{ minRows: 3, maxRows: 6 }}
                />
            }
        },
        {
            dataIndex: 'weight',
            title: 'ККалл',
            width: 50,
            render: (value, record: RecipePartVO, index) => {
                const ingredient = ingredientsDuck.getIngredientByName(record.name)(ingredients)
                return ingredient
                    ? Math.round(ingredient.calories * record.exampleWeight / 1000) * 10
                    : 'N/A'
            }
        },
        {
            dataIndex: 'minimumDivision',
            title: 'Мин.вес',
            width: 50,
            render: (value, record, index) =>{
                const onInputChange = (e) => {
                    const newRecipe = R.set(getPropLens(index, 'minimumDivision'), Number(e.target.value), recipe)
                    dispatch(recipesDuck.actions.updated(newRecipe))
                }

                return  <A.Input value={value} onChange={onInputChange}>

                </A.Input>
            }
        },
        createCheckBoxCol('На похудение', "excludeLosingWeight", true),
        {
            dataIndex: 'name',

            render: (value, record, index) => {
                return  <A.Popconfirm title="Уверены , что хотите удалить ингридиент?" onConfirm={() => onDelete(index)}>
                    <a>Удалить</a>
                </A.Popconfirm>
            }
        },

    ]

    return  <div>
                <A.Button onClick={onAdd} disabled={dispatch == undefined}>Добавить игридент</A.Button>
                <A.Table columns={cols} dataSource={recipe.list} size={'small'} pagination={false}></A.Table>
            </div>
}

export default RecipeCard