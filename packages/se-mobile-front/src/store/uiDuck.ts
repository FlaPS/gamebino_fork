import * as fsa from '@sha/fsa'
import { append, equals, reject } from 'ramda'
import { combineReducers } from 'redux'
import {FactoryAnyAction} from '@sha/fsa'



export type UIState = ReturnType<typeof reducer>

const factory = fsa.actionCreatorFactory('ui')

const actions = {
  busy: factory<any>('busy'),
  unbusy: factory<any>('unbusy'),
  showPopUp: factory<string>('showPopUp'),
  hidePopUp: factory<string>('hidePopUp'),
}




const busyReducers = (state: any[] = [], action: FactoryAnyAction): any[] => {
  if (actions.busy.isType(action))
    return append(action.payload, state)

  if (actions.unbusy.isType(action))
    // @ts-ignore
    return  reject(equals(action.payload), state)

  if (actions.unbusy.isType(action))
    // @ts-ignore
    return  reject(equals(action.payload), state)

  return state
}
const popupsReducer = (state: any[] = [], action: FactoryAnyAction): any[] => {
  if (actions.showPopUp.isType(action))
    return append(action.payload, state)

  if (actions.hidePopUp.isType(action))
      // @ts-ignore
    return  reject(equals(action.payload), state)

  return state
}
const reducer = combineReducers({
  busy: busyReducers,
  popups: popupsReducer
})


export const uiDuck = {
  actions,
  reducer,
  modalTypes: {
    GuestSentQuizModal: 'GuestSentQuizModal',
    PutMoneySuccessModal: 'PutMoneySuccessModal',
    PutMoneyFailedModal: 'PutMoneyFailedModal',
    EmailWarningModal: 'EmailWarningModal'

  }
}
