import React from 'react'
import {connect, useSelector} from 'react-redux'
import 'antd/dist/antd.css'
import {IngredientsPage} from './IngridientsPage'
import { Tabs, Button, Card } from 'antd'
import {RecipesPage} from './recipes/RecipesPage'
import PlanPage from './plan/PlanPage'
import UsersPage from './users/UsersPage'
import PromosPage from './promos/PromosPage'
import {SEAdminState} from '../store/adminReducer'
import ConfigPage from './config/ConfigPage'
import QuickSettings from './QuickSettings'
import SessionsPage from './sessions/SessionsPage'
import CampaignsPage from './campaigns/CampaignsPage'
import {chatMessagesDuck} from 'se-iso/src'
const { TabPane } = Tabs

const tabsList = [
    {
        key: '4',
        tab: 'Chat'
    },
    {
        key: '3',
        tab: 'Пользователи',
    },
];

export default connect( state => ({state}), dispatch => ({dispatch}))(
    ({state, dispatch}: {state: SEAdminState, dispatch: Function}) => {

        const [plan, setPlan] = React.useState([])
        const [activeKey, setActiveKey] = React.useState('3')

        const chatMessages = useSelector(chatMessagesDuck.selectAll) || []

        if (state.app.ui.busy.length !== 0)
            return  <div>
                        Загрузка
                        Статус: <br/>
                        {JSON.stringify(state.app.conn, null, 4)}
                    </div>

        let content

        if(  activeKey === '4' )
            content =   <div>
                Chat:
                {
                    chatMessages.map( obj => <div><b>{obj.username}</b><br/>{obj.text}</div>)
                }
            </div>

        if( activeKey === '1')
            content =   <RecipesPage
                            dispatch={dispatch}
                            ingredients={state.app.bootstrap.ingredients }
                            data={state.app.bootstrap.recipes}
                        />

        if(activeKey === '3')
            content =  <UsersPage/>


        return      <Card
                        style={{ width: '100%' }}
                        tabList={tabsList}
                        activeTabKey={activeKey}
                        onTabChange={setActiveKey}
                        extra={<QuickSettings/> }
                    >
                            {content}
                    </Card>
    }
)
