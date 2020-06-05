import React from 'react'
import {Comment} from 'antd'
import JSONTree from '../../JSONTree'
import {SessionVO} from 'se-iso/src/store/sessionsDuck'
import {useAsyncState} from '@sha/react-fp'
import {useSelector} from 'react-redux'
import {connectionDuck} from 'se-iso/src'
import * as R from 'ramda'
const ipLocation = require("ip-location")

export default ({item}: {item: SessionVO}) => {
    //const ipData = useAsyncState(ipLocation, item.connectionHeaders['x-real-ip'])
    const connection = useSelector(connectionDuck.selector)
    const thisConnection = connection.gateway.includes(item.sessionId)
    return <li>
        <Comment
            style={thisConnection ? {backgroundColor: 'lightgreen'} : {}}
            author={(thisConnection ? 'ТЕКУЩЕЕ СОЕДИНЕНИЕ ' : '') + item.email}

            content={<JSONTree value={R.pick([ 'x-real-ip', 'user-agent', 'origin',],item.connectionHeaders)} ></JSONTree>}
            datetime={new Date(item.createdAt).toLocaleTimeString()}
        >

        </Comment>
    </li>
}