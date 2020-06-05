import React from 'react'
import Rjv from 'react-json-tree'
import rjvTheme from './rjvTheme'


export default ({value, hideRoot = true}: {value: any, hideRoot?: boolean}) =>
    <Rjv data={value} theme={rjvTheme} hideRoot={hideRoot}  />