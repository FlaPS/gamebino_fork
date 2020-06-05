import * as R from 'ramda'
import Fastify from 'fastify'

const log = console.log

const mapApiToRoutes = <T>(fastify: Fastify.FastifyInstance, api: T, prefix = '') =>
    Object
        .keys(api)
        .forEach(
            (route: string) => {
                if ( typeof api[route] !== 'function') {
                    mapApiToRoutes(fastify, api[route], prefix + '/' +route)
                    return
                }
                log('register route', prefix + '/' + route)
                fastify.post(prefix + '/' + route, async (request, reply: any) => {
                    const logId = 'requets '+   new Date() + '\n' + route + '\n' + R.take(1000, request.body)

                    console.time( logId)

                    try {

                        const result = await api[route](request.body, request)

                        console.log('Response', R.take(200, JSON.stringify(result || 'EmptyResponse')))

                        reply
                            .send(result)
                    } catch(e) {
                        console.log('Error response: ' + e, e.stack)
                        reply.code(404).send(e)
                    }
                    console.timeEnd( logId)
                })
                fastify.get(prefix + '/' + route, async (request, reply: any) => {
                    const logId = 'requets '+   new Date() + '\n' + route + '\n' + R.take(1000, JSON.stringify(request.body))
                    console.time(logId)

                    const result =  await api[route](request.body)



                    reply
                        .send(result)
                    console.timeEnd(logId)
                })
            },
        )

export default mapApiToRoutes
