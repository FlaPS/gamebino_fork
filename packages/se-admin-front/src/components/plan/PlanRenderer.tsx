import * as React from 'react'
import * as R from 'ramda'
import {calculatePFCDailyTargets, Day, Dish, SEAdminState, PlanVO, RecipePartVO, RecipeVO} from 'se-iso/src'
import {useSelector} from 'react-redux'
import {getProfileTargetKCals} from 'se-iso/src/ProfileVO'
import * as A from 'antd'
import * as $ from 'jquery'
import {Modal} from 'antd'
import RecipeCard from '../recipes/RecipeCard'
import ShoppingListAdminView from './ShoppingListAdminView'
type PlanRendererProps = {
    plan: PlanVO
    frontState: SEAdminState
    dispatch
}

window['tableToExcel'] = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) {
        return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; })
    }
        , downloadURI = function(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
    }

    return function(table, name, fileName) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        var resuri = uri + base64(format(template, ctx))
        downloadURI(resuri, fileName);
    }
})();

export const PlanRenderer = (props:PlanRendererProps) => {
    const state: SEAdminState = props.frontState
    const profileTargetKcals = getProfileTargetKCals(props.plan.profile)
    const {ingredients, recipes} = state.app.bootstrap

    const dailyTargets = calculatePFCDailyTargets(props.plan.profile)

    const normalizeDigit = (part: RecipePartVO) => (prop: string) => {
        return Math.ceil(part.exampleWeight / 100 * part[prop])
    }


    const [editableDishIndex, setEditableDishIndex] = React.useState(undefined as number)

    const editableDish = state.app.bootstrap.recipes.find(r => r.recipeIndex === editableDishIndex)
    const handleCancel = e => {
        setEditableDishIndex(undefined)
    };
    const renderDay = (day: DayVO, dayIndex: number) => {
        const getTotalForDay = prop => {
            return Object
                .values(day)
                .reduce( (result, dish) =>   result +
                    Math.ceil( dish.list.reduce( (result, part) => result + part.exampleWeight / 100 * part[prop],0)),0)
        }
        const renderDish = (dish: Dish) => {
            const getTotalProp = (prop: string) =>
               Math.ceil( dish.list.reduce( (result, part) => result + part.exampleWeight / 100 * part[prop],0))


            const renderIngredient = (part: RecipePartVO) => {
                const getStr = normalizeDigit(part)
                return [
                    <tr>
                        <td></td>
                        <td></td>
                        <td style={{color: part.top ? 'red' : 'black'}}>{part.name}/{part.fixed}</td>
                        <td >
                            {Math.ceil(part.inputWeight)} -> {Math.ceil(part.tunedWeight)} + {Math.ceil(Number(part.exampleWeight- part.tunedWeight))}
                            <br/>
                            <b>{part.exampleWeight}</b>/<span style={{color: part.top ? 'red' : 'black'}}>{part.maxWeight}</span>
                            </td>
                        <td>{getStr('proteins')}</td>
                        <td>{getStr('fats')}</td>
                        <td>{getStr('carbons')}</td>
                        <td>{getStr('calories')}</td>
                    </tr>
                ]
            }

            const mealIndex = Math.floor(Number(dish.recipeIndex) / 100) - 1
            const mealTarget = dailyTargets.meals[mealIndex]
            return [
                <tr>
                    <td><b>{dayIndex}</b></td>
                    <td><b>{dish.recipeIndex}</b></td>
                    <td>
                        <b><a onClick={() => setEditableDishIndex(dish.recipeIndex)}>{dish.name}</a></b>
                    </td>
                    <td></td>

                    <td><b>{getTotalProp('proteins')}/{Math.round(mealTarget.proteins.min)}-{Math.round(mealTarget.proteins.max)}</b></td>
                    <td><b>{getTotalProp('fats')}/{Math.round(mealTarget.fats.min)}-{Math.round(mealTarget.fats.max)}</b></td>
                    <td><b>{getTotalProp('carbons')}/{Math.round(mealTarget.carbons.min)}-{Math.round(mealTarget.carbons.max)}</b></td>
                    <td><b>{getTotalProp('calories')}/{Math.round(mealTarget.kcals.min)}-{Math.round(mealTarget.kcals.max)}</b></td>
                </tr>,
                ...dish.list.map(renderIngredient)
            ]
        }
        return [
            renderDish(day.breakfast),
            renderDish(day.snack1),
            renderDish(day.dinner),
            renderDish(day.snack2),
            renderDish(day.supper),
            renderDish(day.snack3),
            <tr style={{borderBottom:"1px solid black"}}>
                <td>
                За день
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    {getTotalForDay('proteins')}/{Math.round(dailyTargets.totalDaily.proteins)}
                </td>
                <td>
                    {getTotalForDay('fats')}/{Math.round(dailyTargets.totalDaily.fats)}
                </td>
                <td>
                    {getTotalForDay('carbons')}/{Math.round(dailyTargets.totalDaily.carbons)}
                </td>
                <td>
                    {getTotalForDay('calories')}/{Math.round(dailyTargets.totalDaily.kcals)}
                </td>
            </tr>
        ]
    }

    const [shoppingListIsOpen, setShoppingListIsOpen] = React.useState(false)

    return (
        <div>
            <A.Button onClick={() => window['tableToExcel']('plan', 'План питания', 'План_питания.xls')}>
                Скачать план
            </A.Button>
            <A.Button onClick={() => setShoppingListIsOpen(true)}>
                Список покупок
            </A.Button>
            <Modal
                title="Список покупок"
                visible={shoppingListIsOpen}
                onOk={() => setShoppingListIsOpen(false)}

            >
                <ShoppingListAdminView plan={props.plan} ingredients={props.frontState.app.bootstrap.ingredients} />
            </Modal>
            <table id={'plan'} >
                <tr>
                    <th style={{    minWidth: '120px'}}>День</th>
                    <th style={{    minWidth: '120px'}}>Комплекс</th>
                    <th style={{    minWidth: '120px'}}>Название/ингридиент</th>
                    <th style={{    minWidth: '120px'}}>Граммы</th>
                    <th style={{    minWidth: '120px'}}>Белки/цель</th>
                    <th style={{    minWidth: '120px'}}>Жиры/цель</th>
                    <th style={{    minWidth: '120px'}}>Угл/цель</th>
                    <th style={{    minWidth: '120px'}}>ККалл/цель</th>
                </tr>
                {
                    ...props.plan.days.map(renderDay)
                }
            </table>
            <Modal
                width={1200}
                title={'Редактирование комплекса ' + (editableDish ? editableDish.name : ' ')}
                visible={editableDish !== undefined}
                onOk={handleCancel}
                onCancel={handleCancel}
            >
                {
                    editableDish &&
                    <RecipeCard
                        recipe={editableDish}
                        dispatch={props.dispatch}
                        ingredients={state.app.bootstrap.ingredients}
                    />

                }
            </Modal>
        </div>
    )
}

export default PlanRenderer
