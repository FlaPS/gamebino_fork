import React from 'react'
import * as Ant from 'antd'

const { Header, Content, Footer, Sider } = Ant.Layout
import {SEAdminState, IngredientVO, RecipePartVO, RecipeVO} from 'se-iso/src/store'
import {ColumnProps} from 'antd/lib/table'
import ProfileAdminForm, {exampleProfile, generateExampleProfile} from './ProfileAdminForm'
import {
    getDailyDrinksPFC,
    getDailyGainersGramms, getDailyPFCWithoutGainers,
    getDailyProteinsWithJuiceGramms,
    getProfileMenu,
   Profile
} from 'se-iso/src/ProfileVO'
import {calculatePFCDailyTargets, PlanVO, getPlanDigest} from 'se-iso/src'
import PlanRenderer from './PlanRenderer'
import IngredientsTable from '../IngredientsTable'
import {RecipesPage} from '../recipes/RecipesPage'
import {usePrevious} from '@sha/react-fp'
import QuizBody from '../../../../se-mobile-front/src/components/parts/quiz/QuizBody'
import {Div, StyleReset} from 'atomize'
import PayedPlanParamsBlock from '../../../../se-mobile-front/src/components/parts/PayedPlanParamsBlock'
import {useDispatch} from 'react-redux'
import {connect} from 'react-redux'
const {TabPane} =  Ant.Tabs

import DocsPreview from './DocsPreview'

const PlanEditor = ({state, plan} : {state: SEAdminState, plan: PlanVO}) => {
    const dispatch = useDispatch()

    const [profile, setProfile] = React.useState(plan.profile)

    const menu = getProfileMenu(state.app.bootstrap)(profile)
    console.log('menu', menu)
    const [target, setTarget] = React.useState(calculatePFCDailyTargets(profile))


    const editedPlan = getPlanDigest(state,
        profile,
        28)

    console.log('Грамм гейнера в день', getDailyGainersGramms(profile))
    console.log('Грамм протеина в день', getDailyProteinsWithJuiceGramms(profile))
    console.log('Напиток', getDailyDrinksPFC(profile))
    console.log('Без эдднов', getDailyPFCWithoutGainers(profile))
    console.log('plan:', editedPlan)

    const updateProfile = (profile: Profile) => {
        console.timeEnd('generate plan')
        setProfile(profile)
    }

    return <Ant.Layout>
        <Content>
            <div>
                <Ant.Row>
                    <ProfileAdminForm
                        value={profile}
                        onValueChange={updateProfile}
                        ingredients={state.app.bootstrap.ingredients}
                    />
                </Ant.Row>
                <DocsPreview state={state} plan={editedPlan} />
                <Ant.Row>

                    <Ant.Tabs defaultActiveKey="2">
                        <TabPane tab={'Ингридиенты для профиля'} key={"0"}>
                            <IngredientsTable data={menu.ingredients}/>
                        </TabPane>
                        <TabPane tab={'Рецепты для профиля'} key={"1"}>
                            <RecipesPage data={menu.recipes} ingredients={menu.ingredients}/>
                        </TabPane>
                        <TabPane tab={'План питания'} key={"2"}>
                            <PlanRenderer plan={editedPlan} frontState={state} dispatch={dispatch}/>
                        </TabPane>
                      
                    </Ant.Tabs>

                </Ant.Row>
            </div>
        </Content>
        <Sider width={400}>
                <QuizBody value={profile} onValueChange={ p => updateProfile({...p, dailyPFC: undefined})} />
        </Sider>
    </Ant.Layout>

}


const PlanPage = ({state}: {state}) => {
    const [selectedPlanId, setSelectedPlanId] = React.useState('59be3ee5-9db6-44c7-9763-77c62696047b')

    const plan = state.app.bootstrap.plans.find( p => p.planId === selectedPlanId) ||
         {profile: generateExampleProfile(state.app.bootstrap.ingredients)}
    return <div>
                Идентификатор плана: <Ant.Input value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)}/>
                <PlanEditor plan={plan} state={state}/>
            </div>
}

export default connect( state => ({state}))(PlanPage)
