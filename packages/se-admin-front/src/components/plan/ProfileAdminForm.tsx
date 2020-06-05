import React from 'react'
import * as A from 'antd'
import { Modal, Form, Input, AutoComplete, Checkbox, Select } from 'antd'
import {WithValueProps} from '@sha/react-fp'
import {
    getProfileBasicKCals,
    getProfileDailyKCals,
    getProfileFinalPFC,
    getProfileTargetKCals,
   Profile} from 'se-iso/src/ProfileVO'
import {InputNumber} from 'antd'
import {SEAdminState, IngredientVO} from 'se-iso/src'
import moize from 'moize'
import * as R from'ramda'
import NutritionSetForm from './NutritionSetForm'
const { Option } = Select

export type ProfileFormProps = WithValueProps<ProfileVO> & {ingredients: IngredientVO[]}

export const exampleProfile:Profile= {
    height: 175,
    age: 30,
    weight: 68,
    fitnessLevel: 0,
    gender: 1,
    repeats: 0,
    ingredients: [],
    cookingsPerWeek: 0,
    workoutsPerWeek: 3,
    goal: 0,
    lifestyle: 0,
    motherhood: 0,
}


export const generateExampleProfile = (ingredients: IngredientVO[]):Profile=> ({
    ...exampleProfile,
    ingredients: ingredients.map(i => i.name),

})


const genderOptions = [
    <Option key={0}  value={0}>Женский</Option>,
    <Option key={0}  value={1}>Мужской</Option>,
]

const activityOptions = [
    <Option key={0}  value={0}>Сидячий</Option>,
    <Option key={0}  value={1}>1-3 раза в неделю</Option>,
    <Option key={0}  value={2}>3-5 раз в неделю</Option>,
]

const targetOptions = [
    <Option key={0}  value={0}>Похудеть</Option>,
    <Option key={0}  value={1}>Поддерживать</Option>,
    <Option key={0}  value={2}>Набирать</Option>,
]
const sortByNameCaseInsensitive = R.sortBy(R.toLower);




const ProfileAdminForm = React.memo(({value, onValueChange, ingredients}: ProfileFormProps) => {
    const [state, setState] = React.useState(value)

    const setProp = prop => value => {
        const profileState = {...state, [prop]: value}
        setState({...state, [prop]: value})
        if(onValueChange)
            onValueChange(profileState)
    }


    const allIngredients = sortByNameCaseInsensitive(ingredients.map( i => i.name))

    const ingredientsOptions = allIngredients.map ( value =>
        <Option key={'value'} value={value} >{value}</Option>
    )

    const dailyPFC = value.dailyPFC || getProfileFinalPFC(value)
    return (
        <Form layout={'inline'}>
            {
             /*   <A.Row>
                    <Select
                        placeholder={'Выберите продукты'}
                        mode={'multiple'}
                        value={state.ingredients}
                        onChange={setProp('ingredients')}
                    >
                        {ingredientsOptions}
                    </Select>
                </A.Row>*/
            }


            <Form.Item label={'Б'}>
                <InputNumber value={dailyPFC.p} onChange={v => setProp('dailyPFC')({...dailyPFC, p: v})} style={{ width: '100' }} />
            </Form.Item>
            <Form.Item label={'Ж'}>
                <InputNumber value={dailyPFC.f}  onChange={v => setProp('dailyPFC')({...dailyPFC, f: v})}  style={{ width: '100' }}/>
            </Form.Item>
            <Form.Item label={'У'}>
                <InputNumber value={dailyPFC.c} onChange={v => setProp('dailyPFC')({...dailyPFC, c: v})}  style={{ width: '100' }}/>
            </Form.Item>
            <div>Основной обмен: </div>
            <div>Суточные энергозатраты: </div>
            <div>Целевая каллорийность в сутки : {Math.round(getProfileTargetKCals(state))}</div>

        </Form>
    )
    /**
     *             <NutritionSetForm
     value={value}
     onValueChange={(value) => {
                    setState(value)
                    onValueChange(value)
                }}
     />
     */
}
)


export default ProfileAdminForm