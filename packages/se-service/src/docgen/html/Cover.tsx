import React, { useContext } from 'react'
import {SEServiceState} from '../../store/serviceDuck'
import {PlanCustomDecorScheme, UserVO} from 'se-iso/src/store/usersDuck'
import {
    calculatePFCDailyTargets,
    FullPlan,
} from 'se-iso/src'
import useSchemeBackground from './useSchemeBackground'
import TrainerMeta from "./TrainerMeta";
import DecorContext from "./DecorContext";

export default ({state, plan}: {state: SEServiceState, plan: FullPlan}) => {

  const user = state.app.bootstrap.users.find(u => u.userId === plan.userId)

  const schemeObj = useContext(DecorContext)

  if ((!schemeObj.useCover) && (user.type !== 'personal'))
    return null

  const isTrainer = user.type !== 'personal'

  const renderServiceCover = () =>
            <section 
                className="A4 sheet service cover bg cover4 "
                style={useSchemeBackground('coverBg')}
            >

                <div className="service_logo">
                    <img src="/assets/exampledocs/4a_standart/logo.png"/>
                </div>

            <div className="service_cover_contacts">
                <div className="phone">
                    +7 499 714-64-91
                </div>
                <div className="website">
                    www.smart-eat.ru
                </div>
                <div className="instagram">
                    smarteat_ru
                </div>
            </div>
            <div className="cover_plan_meta_new">
            <div className="plan_person">
                <h1>Индивидуальный<br/>план питания</h1>
                <h2>{plan.profile.fullName}</h2>
            </div>
            </div>
            </section>

    const renderTrainerCover = () =>
        <section 
            className="A4 sheet trainer cover cover1 bg zebra blackline" 
            style={useSchemeBackground('coverBg')}
        >
            <div className="cover_trainer_meta">
            {/*<div className="trainer_meta">*/}
            {/*    <div className="trainer_avatar">*/}
            {/*        <img src="avatar.png" alt="" />*/}
            {/*    </div>*/}
            {/*    <div className="trainer_info">*/}
            {/*    <div className="trainer_name">*/}
            {/*        Андрей Петров*/}
            {/*    </div>*/}
            {/*    <div className="phone">*/}
            {/*        <a href="tel:+7 977 634-71-60">+7 977 634-71-60</a>*/}
            {/*    </div>*/}
            {/*    <div className="instagram">*/}
            {/*        <a href="https://www.instagram.com/smarteat_ru/">smarteat_ru</a>*/}
            {/*    </div>*/}
            {/*    <div className="instagram">*/}
            {/*        <a href="https://www.instagram.com/smarteat_ru/">#smarteat_ru</a>*/}
            {/*    </div>*/}

            {/*    </div>*/}
                {
                    isTrainer &&
                    <TrainerMeta trainer={user} scheme={plan.scheme}></TrainerMeta>
                }
            {/*</div>*/}
            </div>
            <div className="cover_plan_meta_new">
                <div className="plan_person">
                    <h1>Индивидуальный<br/>план питания</h1>
                    <h2>{plan.profile.fullName}</h2>
                </div>
            </div>
      </section>
      
    return user.type === 'personal'
            ? renderServiceCover()
            : renderTrainerCover()
}