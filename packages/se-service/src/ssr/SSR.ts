import {FrontState, PokerRUAppState, configureFrontendStore} from 'poker-ru-iso'
import {Store} from 'redux'
import ReactDOMServer from 'react-dom/server'
import React from 'react'
import App from '../../../poker-ru-front/src/App'
import template from './template'


export default ({reloadTemplate} = {reloadTemplate: true}) => {
    const render = template({reloadTemplate})
    return (store: Store<FrontState>) =>
        (path: string) =>
            render(
                ReactDOMServer.renderToString(
                    React.createElement(
                        App,
                        {
                            store: configureFrontendStore(forkStateWithRoute(store)(path)),
                        },
                    ),
                ),
            )
}

const forkStateWithRoute = (store: any) => (path: string): PokerRUAppState =>
    ({
        ...store.getState(),
        router: {
            location: {
                pathname: path,
                search: '',
                hash: '',
                state: 'PUSH',
                key: Math.random().toString(),
            },
            action: 'PUSH',
        },
    })
