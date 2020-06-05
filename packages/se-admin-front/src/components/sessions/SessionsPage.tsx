import React from 'react'
import {useSelector} from 'react-redux'
import {sessionsDuck, SessionVO} from 'se-iso/src/store/sessionsDuck'
import { Comment, Tooltip, List } from 'antd';
import JSONTree from '../../JSONTree'
import SessionItem from './SessionItem'


export default () => {
    const data = useSelector(sessionsDuck.optics.selectAll)
    return   <List<SessionVO>
        className="comment-list"
        header={`Открыто соединений: ${data.length}`}
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
            <SessionItem item={item} />
        )}
    />
}