import React from 'react'
import * as A from 'antd'
import { Modal, Form, Input, AutoComplete, Checkbox, Select } from 'antd'
import {Day, Dish, IngredientVO, PlanVO, RecipePartVO} from 'se-iso/src'
import {Row, Col, Div} from 'atomize'
import {AssociativeArray, toAssociativeArray, toIndexedArray} from '@sha/utils'
import * as R from 'ramda'



type ShoppingItem = IngredientVO & {gramms?: number}

const dayliParts = (day: DayVO): RecipePartVO[] => ([
    ...day.dinner.list,
    ...day.supper.list,
    ...day.snack1.list,
    ...day.snack2.list,
    ...day.snack3.list,
    ...day.breakfast.list,
])


const monthlyFilter = (part: RecipePartVO) =>
    part.shopPriority >= 10 && part.shopPriority < 20

const weeklyFilter = (part: RecipePartVO) =>
    part.shopPriority >= 20
export default ({plan, ingredients}: {plan: PlanVO, ingredients: IngredientVO[]}) => {
    const generateSection = (section: 0 | 1 |2 |3 | 'month') => {
            const source: AssociativeArray<ShoppingItem> = toAssociativeArray<ShoppingItem>(
                'name')(
                ingredients.map( i => ({...i})) as ShoppingItem[]
            )
            const days = section === 'month'
                ? plan.days
                : R.slice(section * 7, (section + 1) * 7, plan.days)

            const list = R.filter(
                section === 'month' ? monthlyFilter : weeklyFilter,
                R.flatten(days.map(dayliParts)),
            )

            list.forEach( i =>
                source[i.name].gramms = i.exampleWeight + (source[i.name].gramms || 0)
            )

        const items = toIndexedArray(source).filter( i => i.gramms !== undefined && i.gramms !== 0)



            return <>
                    <Row key={'title'}>
                        <Col size={12}>{
                            section === 'month' ? 'На месяц' : ('Неделя ' + Number(section + 1))
                        }</Col>
                    </Row>,
                    {
                        items.map( item =>
                            <Row key={'title'}>
                                <Col size={5}>{item.shopName}</Col>
                                <Col size={7}>{Math.ceil(item.gramms/ item.shopMinimumDivision) * item.shopMinimumDivision}</Col>
                            </Row>
                        )
                    }
                <Row >
                    <Col size={12} >-----</Col>
                </Row>
                </>
    }
    return    [
        generateSection('month'),
        generateSection(0),
        generateSection(1),
        generateSection(2),
        generateSection(3),
    ]
}