import { applyMiddleware, createStore, Dispatch } from 'redux'
import createSagaMiddleware from 'redux-saga'
import {serviceDuck, SEServiceState} from './serviceDuck'
import sagaOptions, {SagaOptions} from '../sagas/SagaOptions'
import eventStore from '../repositories/eventStore'
import {SEServiceConfig} from '../SEServiceConfig'
import {connect} from 'mongodb'
import R from 'ramda'
import {now} from 'moment'
import {generateGuid} from '@sha/random'
//import remotedev from 'remotedev-server'
//remotedev({ hostname: 'localhost', port: 8000 })
//const composeEnhancers = composeWithDevTools({ realtime: true, port: 8000 });


const appliedGuids = []

const configureServiceStore = async (
    config: SEServiceConfig,
) => {
    const sagaMiddleware = createSagaMiddleware()



    let store = createStore(
        serviceDuck.reducer,
        {
            app: {
                bootstrap: {
                    config
                }
            }
        },
       // composeEnhancers(
            applyMiddleware(sagaMiddleware),
       // )
    )

    const nativeDispatch = store.dispatch

    const reduxDispatch = (e: any) => {
        const before = store.getState()
        const result = nativeDispatch(e)
        const after = store.getState()
        return result
    }

    const applyEvent = action => {
        if(action && action.meta && action.meta.persistent) {
            console.log('SAVE EVENT TO STORE', action)
            EventsRepo.create(action)
        }
        reduxDispatch(action)
    }

    const dispatch = (action, extra?: {userId?: string, parentGuid?: string}) => {
        /*if( action && action.meta) {
            action.meta.persistent = false
        }
        */
        action = {...action}
        if (!action.guid)
            action.guid = generateGuid()
        if(!action.storeGuid) {
            action.storeGuid = 'service'
        }
        if(!action.timestamp)
            action.timestamp = now()

        if(!appliedGuids.includes(action.guid)) {
            if(action.payload && action.payload.userId) {
                action.userId = action.payload.userId
            }
            persist(action)
            appliedGuids.push(action.guid)
        }

        return action
    }
    
    const persist = action => {
        action = {
            ...action,
            meta: Object.assign({}, {persistent: true}, action.meta)
        }
        if(!action.type.startsWith('sessions'))
            EventsRepo.create(action)
        reduxDispatch(action)
    }

    const command = action => {
        if( action && action.meta) {
            action.meta.persistent = true
        }

        applyEvent(action)
    }
    store = {...store,
        runSaga: sagaMiddleware.run, dispatch, persist, options: {} as any, command}
    const options = await sagaOptions(config, store)
    store.options = options

    const EventsRepo = await eventStore(options.mongo)
    return store
}

type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends ((...args: any[]) => Promise<infer V>) ? V :
        T
        
export type ServiceStore = ThenArg<ReturnType<typeof configureServiceStore>>

export default configureServiceStore

