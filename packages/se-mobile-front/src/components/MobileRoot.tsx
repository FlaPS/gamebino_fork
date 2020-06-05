import React from 'react'
import {connect} from 'react-redux'
import {ConnectedRouter, Switch} from '@sha/router'
import {HistoryContext, useSubscribe} from '../contexts'
import routes from './routes'
import { ThemeProvider, StyleReset, Div, Icon } from 'atomize'
import GuestSentQuizModal from './modals/GuestSentQuizModal'
import PutMoneyFailed from './modals/PutMoneyFailed'
import PutMoneySuccess from './modals/PutMoneySuccess'
import {SEClientState} from '../store/clientReducer'
import {uiDuck} from '../store/uiDuck'

const theme = {}

const MobileRoot = ({isBusy, popups}: {isBusy: boolean, popups: string[]}) => {
    return  (
    <div>
            <ConnectedRouter history={useSubscribe(HistoryContext)}>
                        {isBusy
                            ?
                                <Div

                                    w={'100vw'}
                                    h={'100vh'}
                                    d={'flex'}
                                    justify="center"
                                    align={'center'}
                                >
                                    <Icon name="Loading" color="black" size="80px" />
                                </Div>
                            :
                                <Switch>
                                    {routes}
                                </Switch>

                        }
            </ConnectedRouter>
    </div>
    )
}

export default connect((state: SEClientState) => ({
    isBusy: state.app.ui.busy.length > 0,
    popups: state.app.ui.popups,
}))(MobileRoot)