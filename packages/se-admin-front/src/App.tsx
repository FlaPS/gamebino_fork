import React from 'react'
import { connect, Provider } from 'react-redux'
import { getBrowserHistory, Redirect, Route, Switch, ConnectedRouter, history  } from '@sha/router'
import { HistoryContext, useSubscribe } from './contexts'


/**
 * Legacy provider used for connected-react-router
 * @constructor
 */
import { Provider as StyletronProvider, DebugEngine } from "styletron-react"
import { Client as Styletron } from "styletron-engine-atomic"

const debug =
    process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

// 1. Create a client engine instance
const engine = new Styletron();
import { ThemeProvider, StyleReset, Div, Icon } from 'atomize'
import QuizBody from '../../se-mobile-front/src/components/parts/quiz/QuizBody'
import DesktopRoot from './components/DesktopRoot'
// 2. Provide the engine to the app
const theme = {}
const App = ({store}) => {
    return (
        <StyletronProvider value={engine} debug={debug} debugAfterHydration>
            <ThemeProvider theme={theme}>
                <div>
                    <StyleReset/>
                        <Provider store={store}>
                            <HistoryContext.Provider value={history}>
                                <ConnectedRouter history={useSubscribe(HistoryContext)}>
                                    <DesktopRoot />
                                </ConnectedRouter>
                            </HistoryContext.Provider>
                        </Provider>
                </div>
            </ThemeProvider>
        </StyletronProvider>
    )

}
export default App
