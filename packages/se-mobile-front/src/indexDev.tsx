import React from 'react'
import ReactDOM from 'react-dom'
import LogRocket from 'logrocket'
console.log('logrocket id ', process.env.LOG_ROCKET)
LogRocket.init(process.env.LOG_ROCKET)

import App from './App'
import {seClientRoot} from './sagas/seClientRoot'
import {globals} from './globals'
import {history} from './history'
import {configureClientStore} from './store/index'

const div = document.getElementById('root') as HTMLDivElement

const store = configureClientStore(undefined, history)
store.runSaga(seClientRoot, globals, history)

window['redux'] = store

ReactDOM.render(
    <App store={store}  />,
    div
)


