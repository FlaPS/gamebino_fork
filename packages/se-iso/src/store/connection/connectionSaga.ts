import {eventChannel} from 'redux-saga'
import {WSFront} from './WSFront'
import {actionChannel, call, fork, put, take, takeLatest, select, takeEvery} from 'redux-saga/effects'
import conn from './connectionDuck'

import {api} from '../../api'
import {isPersistentAction} from '../../index'

const sentGuids = []

export default function* connectionSaga(co) {

  const config = yield select(state => state.app.config)

  const ws = new WSFront()
  yield takeLatest(conn.actions.gatewayChanged.isType, reconnectSocket, ws)

  yield fork(readWorker, ws)


    yield fork(writeWorker, ws)

  yield takeEvery(
      conn.actions.serverPushed.isType,
      function* (action: typeof conn.actions.serverPushed.example) {
        if (!sentGuids.includes(action.payload.guid)) {
          const forward = {...action.payload, external: true}
          yield put(forward)
        }
  })

  function* reconnectSocket(ws: WSFront, action: typeof conn.actions.gatewayChanged.example) {
    ws.connect(action.payload)
  }

  function* readWorker(ws: WSFront) {
    const channel = eventChannel(emit => {
      ws.dispatch = emit
      return ws.dispose
    })


    while (true) {
      const action = yield take(channel)
      const url = yield select(state => state.app.conn.gateway)
      const params = new URLSearchParams(url)
      const storeGuid = params.get('storeGuid')
      const userId = params.get('userId')


      if (!sentGuids.includes(action.guid)) {
        if(action.storeGuid !== storeGuid) {
          if (!sentGuids.includes(action.guid))
          yield put(action)
        }
      }
    }
  }



  function* writeWorker(ws: WSFront) {



    while (true) {
      const action = yield take('*')
      if(!isPersistentAction(action)) {
        continue
      }
      const meta = yield select(state => state.meta)
      const url = yield select(state => state.app.conn.gateway)
      const params = new URLSearchParams(url)
      const storeGuid = params.get('storeGuid')
      const userId = params.get('userId') || 'guest'



      if (!sentGuids.includes(action.guid) && action.storeGuid === undefined) {


            if(!action.external) {
              sentGuids.push(action.guid)
              // const actionToSend = R.assocPath(['meta', 'storeGuid'], storeGuid, action)
              action.role = userId
              //action.userId = action.userId || action.payload.userId || action.payload.userId
              action.storeGuid = storeGuid
              if( meta.userId !== 'guest' && meta.userId !== 'admin' && meta.userId !== 'service' && meta.userId && !action.userId)
                action.userId = meta.userId
              const endpoint = api(yield select())
              console.log('sending action', action)
              yield call(endpoint.pushCommands, [action])

              console.log("SEND", action)
            }

        }
      }
  }

}


