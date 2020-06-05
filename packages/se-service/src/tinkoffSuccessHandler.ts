import {SagaOptions} from './sagas/SagaOptions'
import {TinkoffSuccessIncomingRequest, usersDuck} from 'se-iso/src/store/usersDuck'
import commands from 'se-iso/src/store/commands'
import {campaignsDuck} from 'se-iso/src'



export default (io: SagaOptions) => async (payload: TinkoffSuccessIncomingRequest)  => {
    if(payload.Success && payload.Status === 'CONFIRMED') {
        const userId = payload.OrderId.split('/')[0]
        const user = io.store.getState().app.bootstrap.users.find(u => u.userId === userId)

        const command = commands.tinkoffDeposit(payload, null,{userId})
        const action = usersDuck.actions.tinkoffDeposited(payload)
        action.userId = userId
        action.parentGuid = command.guid
        if(user.campaignId) {
            const campaignAction = campaignsDuck.actions.leadDeposited({
                userId: user.userId,
                campaignId: user.campaignId,
                amount: payload.Amount / 100,
            })
            campaignAction.parentGuid = command.guid
            io.store.dispatch(campaignAction)
        }
        io.store.dispatch(command)
        io.store.dispatch(action)
    }
    return "OK"
}
