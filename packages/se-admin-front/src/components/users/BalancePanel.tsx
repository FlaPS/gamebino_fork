import {Button, Input, Select} from 'antd'
import React from 'react'
import {usersDuck} from 'se-iso/src/store/usersDuck'
import {useDispatch} from 'react-redux'
const {Option} = Select

const { TextArea } = Input;
export default ({userId}: {userId: string}) => {
    const [amount, setAmount] = React.useState()
    const [comment, setComment] = React.useState()
    const [actionName, setActionName] = React.useState(usersDuck.actions.balanceDepositedByAdmin.type)
    const isValid = !isNaN(Number(amount)) && comment
    const dispatch = useDispatch()
    const onApply = () => {
        setAmount(undefined)
        setComment(undefined)
        const action = actionName === usersDuck.actions.balanceDepositedByAdmin.type
            ? usersDuck.actions.balanceDepositedByAdmin({amount, comment})
            : usersDuck.actions.balanceWithdrawnByAdmin({amount, comment})
        action.userId = userId
        dispatch(action)
    }
    return <div>
            <Input.Group compact>
                <Select value={actionName} onChange={e => setActionName(e)}>
                    <Option value={usersDuck.actions.balanceDepositedByAdmin.type}>Добавить</Option>
                    <Option value={usersDuck.actions.balanceWithdrawnByAdmin.type}>Снять</Option>
                </Select>
                <Input
                    style={{ width: '50%' }}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    addonAfter={<Button disabled={!isValid} onClick={onApply}>Go</Button>}/>
            </Input.Group>
            <TextArea rows={4} placeholder={"Укажите причину, номер поступления, контекст диалога..."}  value={comment} onChange={e => setComment(e.target.value)}/>
        </div>

}