import React from 'react'
import {SEServiceState} from '../../store/serviceDuck'
import {UserVO} from 'se-iso/src/store/usersDuck'
import {
    calculatePFCDailyTargets,
    Day,
    Dish, generateShoppingList,
    MealTitle,
    mealTitles,
    PlanVO,
    FullPlan,
} from 'se-iso/src'
import * as R from 'ramda'
import {ShoppingListItem} from 'se-iso/src/utils/generateShoppingList'
import TrainerMeta from './TrainerMeta'
import useSchemeBackground from './useSchemeBackground'

export default ({state, plan}: {state: SEServiceState, plan: FullPlan}) => {

    const user = state.app.bootstrap.users.find(u => u.userId === plan.userId)
    const shoppingList = generateShoppingList(state.app.bootstrap.ingredients, plan)
    const isTrainer = user.type !== 'personal'
    return  <section className={ isTrainer ? 'A4 sheet trainer list bg1 blackline ' : 'A4 sheet service list bg5 blackline'}
                     style={useSchemeBackground('shoppingListBg')}
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
                        Список покупок
                    </div>
                    <div className="plan_person">
                        Индивидуальный план питания<br/>
                        <strong>{plan.profile.fullName}</strong>
                    </div>
                </div>
                {
                    isTrainer &&
                    <TrainerMeta trainer={user} scheme={plan.scheme }></TrainerMeta>
                }
        </div>
        <div className="plan_scheet">
            <table className="general vbordered hbordered">
                <tr>
                    <th>На месяц</th>
                    <th>1 неделя</th>
                    <th>2 неделя</th>
                    <th>3 неделя</th>
                    <th>4 неделя</th>
                </tr>
                <tr>
                    <SubListView data={shoppingList.month} />

                    <SubListView data={shoppingList.weeks[0]} />

                    <SubListView data={shoppingList.weeks[1]} />

                    <SubListView data={shoppingList.weeks[2]} />

                    <SubListView data={shoppingList.weeks[3]} />

                </tr>
            </table>
        </div>
        {
            !isTrainer &&
            <div className="footer">
                <table>
                    <tr>
                        <td className="aleft"><a className="smarteat"
                                                 href="https://www.smart-eat.ru/">www.smart-eat.ru</a>
                        </td>
                        <td className="acenter"><a href="tel:+7 499 714-64-91">+7 499 714-64-91</a></td>
                        <td className="aright"><a className="instagram"
                                                  href="https://www.instagram.com/smarteat_ru/">smarteat_ru</a></td>
                    </tr>
                </table>
            </div>
        }
    </section>
}

const SubListView = ({data}: {data: ShoppingListItem[]}) => {
    return  <td className="odd">
                <table>
                    {data.map( (value, index) =>
                        <ShoppingItemView value={value} key={index}/>
                    )}
                </table>
            </td>
}

const ShoppingItemView = ({value}: {value: ShoppingListItem}) =>
    <tr>
        <td>{value.name}</td>
        <td className="aright">{value.amount}</td>
    </tr>
