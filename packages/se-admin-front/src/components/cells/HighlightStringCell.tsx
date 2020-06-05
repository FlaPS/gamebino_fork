import React, {useContext} from 'react'

import {Typography} from 'antd'
import {SearchContext} from '../../contexts'

const {Text} = Typography

export default ({children = ''}: {children: string}) => {
    const search = useContext(SearchContext)

    let result = children
    if(search) {
        const regexp = RegExp(search, 'ig');
        const str = children
        const matches = str.matchAll(regexp);
        const chunks = []
        const firstFlag = true
        let lastPosition = 0
        for (const match of matches) {
            const start = match.index
            const end = match[0].length

            lastPosition = end
        }
    }
    return <div></div>
}