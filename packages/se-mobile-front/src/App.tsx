import React from 'react'
import { connect, Provider } from 'react-redux'
import {ConnectedRouter  } from '@sha/router'
import { HistoryContext, useSubscribe } from './contexts'
import MobileRoot from './components/MobileRoot'
import { history } from './history'
import 'antd/dist/antd.css';
/**
 * Legacy provider used for connected-react-router
 * @constructor
 */
import { Provider as StyletronProvider, DebugEngine } from "styletron-react"
import { Client as Styletron } from "styletron-engine-atomic"


// 2. Provide the engine to the app
const theme = {
    fontFamily: {
        primary: 'Rubik, monospace'
    },
    textSize: {
        size: {
            tiny: "10px",
            caption: "12px",
            body: "1rem",
            paragraph: "1rem",
            subheader: "17px",
            title: "22px",
            heading: "26px",
            display1: "32px",
            display2: "40px",
            display3: "56px"
        },
        height: {
            tiny: "16px",
            caption: "20px",
            body: "1.5rem",
            paragraph: "1.6rem",
            subheader: "30px",
            title: "32px",
            heading: "40px",
            display1: "48px",
            display2: "48px",
            display3: "64px"
        }
    }
}

const App = ({store}) => {
    return (

            <div>

                    <Provider store={store}>
                        <HistoryContext.Provider value={history}>
                            <ConnectedRouter history={useSubscribe(HistoryContext)}>

                                <MobileRoot />

                            </ConnectedRouter>
                        </HistoryContext.Provider>
                    </Provider>

            </div>
    )
}

export default App
