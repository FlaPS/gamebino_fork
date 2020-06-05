import * as fsa from '@sha/fsa'
import {FactoryAnyAction} from '@sha/fsa'

const factory = fsa.actionCreatorFactory('connection')

const actions = {
  factory,
  connected: factory<undefined>('CONNECTED'),
  disconnected: factory<undefined>('DISCONNECTED'),
  error: factory<string>('ERROR'),
  failed: factory<string>('FAILED'),
  gatewayChanged: factory<string>('GATEWAY_CHANGED'),
  fetchStateRequested: factory<string>('FETCH_STATE_REQUESTED'),
  fetchStateSuccessed: factory<any>('FETCH_STATE_SUCCESSED'),
  fetchStateFailed: factory<string>('FETCH_STATE_FAILED'),
  serverPushed: factory<FactoryAnyAction>('SERVER_PUSHED'),
  clientPushed: factory<FactoryAnyAction>('CLIENT_PUSHED'),
}


/**
 * Describes the connection information
 */
export interface ConnectionState {
  isConnected?: boolean
  gateway?: string
  error?: string
  doReconnect?: boolean

  /**
   * is credentials connected to master ?
   */
  isMaster?: boolean
}

const reducer = (state: ConnectionState = {isConnected: false}, action: fsa.FactoryAnyAction) => {

  if (actions.connected.isType(action))
    return {...state, isConnected: true, error: undefined}

  else if (actions.disconnected.isType(action))
    return {...state, isConnected: false}

  else if (actions.error.isType(action))
    return {...state, error: action.payload, isConnected: false}

  else if (actions.gatewayChanged.isType(action))
    return {...state, gateway: action.payload, error: undefined, isConnected: false}

  return state
}

const selector = (state: {app: {conn: ConnectionState}}) => state.app.conn

const connectionDuck = {
  reducer,
  actions,
  factory,
  selector,
}

export default connectionDuck
