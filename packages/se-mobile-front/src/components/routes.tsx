import {nav} from '../nav'
import {Route} from '@sha/router'
import Regime from './pages/Regime';

import React from 'react'
import SignInPage from './pages/SignInPage'


const routes = [
    {
        nav: nav.signIn,
        label: 'Логин',
        Component: SignInPage,

    },
    {
        nav: nav.regime,
        label: 'Мои клиенты',
        Component: Regime,

    }

]

export default routes
    .map(({ Component, nav, exact = true }) => (
        <Route
            exact={exact}
            key={nav.pattern}
            path={nav.pattern}
            render={props => (
                // @ts-ignore
                <Component {...props.match.params as any} />
            )}
        />
    ))
