import {Action} from 'redux'
import conn from './connectionDuck'
import {generateGuid} from '@sha/random'
import {StoreMeta} from '../metaDuck'



const logger = console

export class WSFront {

  public static getWSSRoute = (meta: {storeGuid: string, userId: string}) =>
      ((window.location.protocol === "https:")
          ? "wss://"
          : "ws://"
      ) + window.location.host + "/ws/?&" + new URLSearchParams(meta).toString()

  public meta: StoreMeta
  public connect = (gateway: string) => {
    if (gateway && this.dispatch) {
      if (gateway === this.gateway)
        return
      this.gateway = gateway
    }
    const params = new URLSearchParams(gateway)
    this.meta = {
      userId:  params.get('userId'),
      storeGuid: params.get('storeGuid')
    }

    if (!this.gateway) {
      console.error('No socket gateway. Please, check BTCE_NEXT_WS_GATEWAY variable')
      return
    }


    console.log('gateway ', gateway)

    if (this.ws)
      this.freeSocket()
    try {
      this.ws = new WebSocket(this.gateway)
      this.ws.addEventListener('open', this.openListener)
      this.ws.addEventListener('close', this.closeListener)
      this.ws.addEventListener('error', this.closeListener)
      this.ws.addEventListener('message', this.messageListener)
    } catch (e) {
      this.dispatch(conn.actions.error('Не удалось подключиться к серверу'))
    }
  }

  send = <T extends Action>(action: T) => {
    const actionToSend = {...action, ...this.meta}
    this.ws.send(JSON.stringify(actionToSend))
  }

  freeSocket = () => {
    clearTimeout(this.reconnectTimeoutId)
    this._connected = false
    this.ws.removeEventListener('open', this.openListener)
    this.ws.removeEventListener('close', this.closeListener)
    this.ws.removeEventListener('error', this.closeListener)
    this.ws.removeEventListener('message', this.messageListener)
    this.ws.close()
  }
  dispose = () =>
    this.freeSocket()

  protected closeListener = (): any => {
    this.dispatch(conn.actions.failed('any'))
    logger.warn('socket closed')
    this.freeSocket()
    this.reconnectTimeoutId = setTimeout(this.connect, 1000)
  }

  protected openListener = (): any => {
    this._connected = true
    this.dispatch(conn.actions.connected(undefined))
  }

  protected messageListener = (ev: MessageEvent): any => {
    const message = JSON.parse(ev.data)
    logger.info('Receive message', message)
    if(message.storeGuid !== this.meta.storeGuid)
      this.dispatch(message)
  }

  private reconnectTimeoutId
  private userId: string
  private ws: WebSocket
  private gateway: string

  constructor(public dispatch?) {

  }

  private _connected: boolean = false

  public get connected(): boolean {
    return this._connected
  }

}
