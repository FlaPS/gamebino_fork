import React from 'react'
import ReactDOM from 'react-dom'
import * as R from 'ramda'
import App from './App'
import {seAdminSaga} from './sagas/seAdminSaga'
import {globals} from './globals'
import configureAdminStore from './store/adminStore'
const div = document.getElementById('root') as HTMLDivElement

const store = configureAdminStore()

store.runSaga(seAdminSaga, globals)

window['store'] = store
window['R'] = R
ReactDOM.render(
    <App store={store}  />,
    div
)