import Fastify from 'fastify'
import WSBack from '../io/WSBack'
import querystring from 'querystring'
import {SagaOptions} from '../sagas/SagaOptions'
import {broadcastEventsSaga} from '../sagas/broadcastEventsSaga'
import {StoreMeta} from 'se-iso/src/store/metaDuck'

export default (io: SagaOptions, fastify: Fastify.FastifyInstance) => {
    let wrapped = fastify.register(require('fastify-websocket'))

    wrapped.get('/ws', { websocket: true }, (connection, req) => {
        const {storeGuid,userId} = querystring.parse(req.url) as any as StoreMeta
        const socket = new WSBack(
            connection.socket,
            io,
            {userId, storeGuid},
            req.headers,
        )

    })

    io.store.runSaga(broadcastEventsSaga)

    return wrapped
}

