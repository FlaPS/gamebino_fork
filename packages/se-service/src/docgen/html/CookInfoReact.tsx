import React from 'react'
import {SEServiceState} from '../../store/serviceDuck'
import {usersDuck, UserVO} from 'se-iso/src/store/usersDuck'
import {FullPlan,} from 'se-iso/src'
import getRecipe from '../../getRecipe'

import useSchemeBackground from './useSchemeBackground'


type CookTagsType = {
  breakfasts: string[]
  snacks: string[]
  dinners: string[]
  suppers: string[]
  all: string[]
}

export default ({state, plan}: { state: SEServiceState, plan: FullPlan }) => {

  const user = usersDuck.selectById(plan.userId)(state);//state.app.users.find(u => u.userId === plan.userId)
  const isTrainer = user.type !== 'personal';
  const days = plan.days || [];

  const cookTags: CookTagsType = {
    breakfasts: [],
    snacks: [],
    dinners: [],
    suppers: [],
    all: []
  };


  days.map((day): void => {
    day.breakfast.list.map(ingredient => {
      if ((ingredient.cookInfo) && (!cookTags.all.includes(ingredient.cookInfo))) {
        cookTags.all.push(ingredient.cookInfo);
        cookTags.breakfasts.push(ingredient.cookInfo)
      }
    });
    day.snack1.list.map(ingredient => {
      if ((ingredient.cookInfo) && (!cookTags.all.includes(ingredient.cookInfo))) {
        cookTags.all.push(ingredient.cookInfo);
        cookTags.snacks.push(ingredient.cookInfo)
      }
    });
    day.snack2.list.map(ingredient => {
      if ((ingredient.cookInfo) && (!cookTags.all.includes(ingredient.cookInfo))) {
        cookTags.all.push(ingredient.cookInfo);
        cookTags.snacks.push(ingredient.cookInfo)
      }
    });
    day.snack3.list.map((ingredient) => {
      if ((ingredient.cookInfo) && (!cookTags.all.includes(ingredient.cookInfo))) {
        cookTags.all.push(ingredient.cookInfo);
        cookTags.snacks.push(ingredient.cookInfo)
      }
    });
    day.dinner.list.map((ingredient) => {
      if ((ingredient.cookInfo) && (!cookTags.all.includes(ingredient.cookInfo))) {
        cookTags.all.push(ingredient.cookInfo);
        cookTags.dinners.push(ingredient.cookInfo)
      }
    });
    day.supper.list.map((ingredient) => {
      if ((ingredient.cookInfo) && (!cookTags.all.includes(ingredient.cookInfo))) {
        cookTags.all.push(ingredient.cookInfo);
        cookTags.suppers.push(ingredient.cookInfo)
      }
    })
  });

  // console.log("cookTags", cookTags);

  return <>
    {cookTags.breakfasts.map((cookTag, index) =>
      <SingleRecipe key={index} state={state} plan={plan} user={user} index={index} header={'Завтраки'}
                    cookTag={cookTag} PageCount={index + 1}/>
    )}
    {cookTags.snacks.map((cookTag, index) =>

      <SingleRecipe key={index} state={state} plan={plan} user={user} index={index} header={'Перекусы'}
                    cookTag={cookTag} PageCount={cookTags.breakfasts.length + index + 1}/>
    )}
    {cookTags.dinners.map((cookTag, index) =>
      <SingleRecipe key={index} state={state} plan={plan} user={user} index={index} header={'Обеды'}
                    cookTag={cookTag}
                    PageCount={cookTags.snacks.length + cookTags.breakfasts.length + index + 1}/>
    )}
    {cookTags.suppers.map((cookTag, index) =>
      <SingleRecipe key={index} state={state} plan={plan} user={user} index={index} header={'Ужины'}
                    cookTag={cookTag}
                    PageCount={cookTags.dinners.length + cookTags.snacks.length + cookTags.breakfasts.length + index + 1}/>
    )}

  </>
}

const SingleRecipe = ({state, plan, user, index, cookTag, header, PageCount}:
                        { state: SEServiceState, plan: FullPlan, user: UserVO, index: number, cookTag: string, header: string, PageCount: number }) => {

  const isTrainer = user.type !== 'personal';


  return <section
    className={isTrainer ? 'A4 sheet trainer list bg1 blackline ' : 'A4 sheet service list bg5 blackline'}
    style={useSchemeBackground('recipesBg')}
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
          Рецепты
        </div>
        <div className="plan_person">
          Индивидуальный план питания<br/>
          <strong>{plan.profile.fullName}</strong>
        </div>

      </div>

    </div>
    <div className="plan_scheet" style={{marginTop: '0mm'}}>
      {
        index === 0 &&
        <div className="plan_week acenter">
          {header}
            <br/>
            <br/>

        </div>
      }

      <br/>
      <div className='cook_info' dangerouslySetInnerHTML={{__html: getRecipe(cookTag)}}>
      </div>

      {
        !isTrainer &&
        <div className="footer">
            <table>
                <tr>
                    <td colSpan={3} className="aright">
                        Страница {PageCount}
                    </td>
                </tr>

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
      {
        isTrainer &&
        <div className="footer">
            <table>
                <tr>
                    <td colSpan={3} className="aright">
                        <p>
                            Страница {PageCount}
                        </p>
                    </td>
                </tr>
            </table>
        </div>
      }
    </div>

  </section>
};