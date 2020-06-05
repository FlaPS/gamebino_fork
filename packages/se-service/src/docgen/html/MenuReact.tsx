import React from 'react'
import {SEServiceState} from '../../store/serviceDuck'
import {UserVO} from 'se-iso/src/store/usersDuck'
import {
    calculatePFCDailyTargets,
    Day,
    Dish,
    MealTitle,
    mealTitles,
    PlanVO,
    RecipePartVO,
    RecipeVO,
    FullDish,
    FullPlan,
    plansDuck
} from 'se-iso/src'
import * as R from 'ramda'
import TrainerMeta from './TrainerMeta'
import useSchemeBackground from './useSchemeBackground'
import Cover from './Cover'
function isEven(n) { return n % 2 == 0; }

export default ({state, plan, scheme}: {state: SEServiceState, plan: FullPlan, scheme: string}) => {

    const user = state.app.bootstrap.users.find(u => u.userId === plan.userId)

    const isTrainer = user.type !== 'personal'
    let days = plan.days || []
  

    const weeks = R.splitEvery(7, days || [])

    return <>
                {plan.isPayed && <Cover state={state} plan={plan}  />}

                {weeks.map((week, weekNumber) =>
                        <Week days={week} key={weekNumber} weekNumber={weekNumber} user={user} plan={plan} scheme={scheme}/>
                    )
                }
            </>
}

const Week = ({days, weekNumber, user, plan, scheme}: {days: Day[], weekNumber: number, user: UserVO, plan: FullPlan, scheme: string}) => {
    const nuts = calculatePFCDailyTargets(plan.profile)

    const isTrainer = user.type !== 'personal'


    return   <section className={
                        isTrainer ?
                                    "A4 sheet trainer  plan zebra blackline"
                                    : "A4 sheet service plan zebra"}
                      style={useSchemeBackground('menuBg')}
    >

                <div className={'plan_trainer_meta'}>
                    <div className="plan_meta">
                        {
                            !isTrainer &&
                            <div className="service_logo">
                            <img src="/assets/exampledocs/4a_standart/logo.png"/>
                            </div>
                        }
                        <div className="plan_week">
                            {Number(weekNumber + 1)} неделя
                        </div>
                        <div className="plan_person">
                            {plan.isPayed 
                                ? 'Индивидуальный план питания' 
                                : (
                                    'Пример плана на ' + plansDuck.getDemoPlanDuration(plan)
                                )
                                }
                            <br/>
                            <strong>{plan.profile.fullName}</strong>
                        </div>

                        <table className="kbgu">
                            <tr>
                                <th>{Math.round(nuts.totalDaily.proteins)}</th>
                                <th>{Math.round(nuts.totalDaily.fats)}</th>
                                <th>{Math.round(nuts.totalDaily.carbons)}</th>
                                <th>{Math.round(nuts.totalDaily.kcals)}</th>
                            </tr>
                            <tr>
                                <td>белок</td>
                                <td>жир</td>
                                <td>углеводы</td>
                                <td>ккал</td>
                            </tr>
                        </table>
                    </div>
                    {
                        isTrainer &&
                        <TrainerMeta trainer={user} scheme={plan.scheme}></TrainerMeta>
                    }
                </div>
            <div className="plan_scheet">
                {
                    //!plan.isPayed && <div className="demooverlay"></div>
                }
                <table className="general vbordered hbordered">
                    <tr>
                        <th></th>
                        <th>Понедельник</th>
                        <th>Вторник</th>
                        <th>Среда</th>
                        <th>Четверг</th>
                        <th>Пятница</th>
                        <th>Суббота</th>
                        <th>Воскресенье</th>
                    </tr>
                    {
                        ([0,1,2,3,4,5]).map(
                            (index) =>
                                <MealRow
                                    key={index}
                                    mealItem={mealTitles[index]}
                                    days={days}
                                    even={isEven(index)}
                                    isDemo={!plan.isPayed}
                                />
                        )
                    }
                </table>
                {
                    !isTrainer &&
                    <div className="footer">
                        <table>
                            <tr>
                                <td className="aleft">
                                    <a className="smarteat" href="https://www.smart-eat.ru/">
                                        www.smart-eat.ru
                                    </a>
                                </td>
                                <td className="acenter">
                                    <a href="tel:+7 499 714-64-91">+7 499 714-64-91</a>
                                </td>
                                <td className="aright">
                                    <a className="instagram" href="https://www.instagram.com/smarteat_ru/">
                                        smarteat_ru
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </div>
                }
            </div>
    </section>
}

const MealRow = ({days, mealItem, even, isDemo}:
                     {days: DayVO[], even: boolean, isDemo: boolean, mealItem: {prop: MealTitle, name: string}}
                 ) => {
    return <tr>
        <td className="meal_type">
            <div className="meal_type_wrapper">
                <p>
                    {
                        mealItem.name
                    }
                </p>
            </div>
        </td>
        {
            days.map( (day, index) =>
                <MealCell
                    dish={day ? day[mealItem.prop] : undefined}
                    key={index}
                    isEven={even ? isEven(index) : !isEven(index)}
                    isDemo={day === undefined}
                />
            )
        }
    </tr>

}

const MealCell = ({isEven,dish, isDemo}: {isEven: boolean, dish: FullDish, isDemo: boolean}) => {
    return    <td className={"meal " + (isEven ? 'even' : 'odd') + (isDemo ? ' blur' : '')}>
                <div className="meal_title">
                    {dish && dish.name}:

                </div>
                <table className="meal_list">
                    {
                        dish && dish.list.map( (part, index) =>
                            <tr key={index}>
                                <td>{part.name}</td>
                                <td className="aright">{part.exampleWeight}г.</td>
                            </tr>
                        )
                    }
                </table>
            </td>
}
