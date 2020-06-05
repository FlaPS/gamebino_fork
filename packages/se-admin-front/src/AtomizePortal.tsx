import React from 'react'


import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import { ThemeProvider, StyleReset, Div, Icon, Button } from 'atomize'
const debug =
    process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

// 1. Create a client engine instance
const engine = new Styletron();

export default ({children}) =>
    <StyletronProvider value={engine} debug={debug} debugAfterHydration>
        {children}
    </StyletronProvider>