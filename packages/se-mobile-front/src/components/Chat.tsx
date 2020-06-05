import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {chatMessagesDuck} from 'se-iso/src'
import {Button, Input} from 'antd'
import {usersDuck} from 'se-iso/src/store/usersDuck'
import {generateGuid} from '@sha/random'

export default () => {
    const chatMessages = useSelector(chatMessagesDuck.optics.selectAll)
    const user = useSelector(usersDuck.selectCurrentUser)
    const dispatch = useDispatch()
    const [text, setText] = useState('')
    const onSendMessage = () => {
        setText('')
        const action = chatMessagesDuck.actions.added({
            chatMessageId: generateGuid(),
            text,
            role: 'user',
            userId: user.userId, username: user.email
        })
        action.meta.persistent = true
        dispatch(action)
    }

    return <div>
        <Input value={text} onChange={e => setText(e.currentTarget.value)}></Input>

        <Button onClick={onSendMessage}> Отправить</Button>
    <br/>
        Chat:
        {
            chatMessages.map( obj => <div><b>{obj.username}</b><br/>{obj.text}</div>)
        }

    </div>
}