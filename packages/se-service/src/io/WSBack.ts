import * as WebSocket from 'ws'
import * as fsa from '@sha/fsa'
import {FactoryAnyAction, getActionInfo} from '@sha/fsa'
import {StoreMeta} from 'se-iso/src/store/metaDuck'
import conn from 'se-iso/src/store/connection/connectionDuck'
import {SagaOptions} from '../sagas/SagaOptions'
import {sessionsDuck} from 'se-iso/src/store/sessionsDuck'
import {now} from '@sha/utils'
import {usersDuck} from 'se-iso/src/store/usersDuck'

const { log, error, warn} = console

export default class WSBack {

    public static broadcastAction = (action: fsa.FactoryAnyAction) => {


        for (let i = 0; i < WSBack.sockets.length; i++) {
                WSBack.sockets[i].send(action)
        }
    }

    public static clearSockets = () => {
        while (WSBack.sockets.length)
            WSBack.sockets[0].dispose()
    }

    private static sockets: WSBack[] = []

    send = <T extends fsa.FactoryAnyAction>(action: T) => {

        if(this.meta.userId === 'guest' )
            return

        if(this.meta.userId === 'admin' || this.meta.userId === 'service' || this.meta.userId === action.userId || action.userId === 'admin') {
            console.log('Sending action', action, this.meta)
            try {
                const pushAction = conn.actions.serverPushed(action)
                this.ws.send(JSON.stringify(pushAction))
            } catch (e) {
                error('Could not send action'+ action.guid+ ' to socket. Socket closed', JSON.stringify(e))
                this.dispose()
            }
        }
    }

    dispose = () => {
        this.isOpened = false
        const index = WSBack.sockets.indexOf(this)
        if (index !== -1)
            WSBack.sockets.splice(index, 1)
        this.listener(sessionsDuck.actions.removed(this.meta.storeGuid))
        this.ws.removeAllListeners()
        this.ws.close()
    }

    private isOpened: boolean

    private openListener = () => {
        this.isOpened = true

        //this.send(BootstrapISO.actions.reseted(store.getState().bootstrap))
    }

    private messageListener = (data: any, flags: { binary: boolean }) => {

        const message = this.parseAction(data)
       // message.meta = { ...message.meta, storeGuid: this.guid }
        this.listener({...message})
        //store.dispatch(message)
        //WSBack.broadcastAction(message, this)
    }

    private parseAction = (data: string): fsa.FactoryAnyAction => {
        let message: fsa.FactoryAnyAction
        try {
            message = JSON.parse(data)

            if(this.meta.userId !== 'admin' && this.meta.userId !== 'guest' && this.meta.userId!=='service' && this.meta.userId) {
                message.userId = this.meta.userId
            }
        } catch (e) {
            error('Could not parse socket message ', e, this)
            message = { type: 'error', payload: 'errorPayload', guid: ''}
        }

        return message
    }
    private listener: (data: FactoryAnyAction) => void
    /**
     * Socket already connected
     * @param ws
     */
    constructor(
        protected ws: WebSocket,
        private io: SagaOptions,
        public readonly meta: StoreMeta,
        public readonly headers: any
    ) {

        WSBack.sockets.push(this)

        this.listener = io.store.dispatch
        this.ws.addListener('message', this.messageListener)
        this.ws.addListener('open', this.openListener)
        this.ws.addListener('close', this.dispose)

        const user = usersDuck.selectById(meta.userId)(io.store.getState())

        let email = meta.userId
        if(user)
            email = user.email
        this.listener(sessionsDuck.actions.added({
            connectionHeaders: headers,
            createdAt: new Date().toISOString(),
            userId: meta.userId,
            sessionId: meta.storeGuid,
            email: email || meta.userId,
            updatedAt: new Date().toISOString(),
        }))

    }
}

