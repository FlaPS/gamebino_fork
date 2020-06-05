import path from 'path'
import Fastify from 'fastify'
import { SagaOptions } from '../sagas/SagaOptions'
import fastifyStatic from 'fastify-static'
import router from './routes'
import wsRoute from './wsRoute'
const root = path.join(__dirname, '..', '..', '..', 'se-mobile-front', 'public')

export default async (io: SagaOptions) => {
    let fastify = Fastify({
        ignoreTrailingSlash: true,
        bodyLimit: 1048576 * 4,
        logger: io.logger,
        trustProxy: true,
        // ?modifyCoreObjects:false"
    });
  
    const blipp  = require("fastify-blipp")
    // register it as early as possible
    fastify.register(blipp);


    fastify.register(require('fastify-error-page'))
    fastify.register(require('fastify-cors'), {origin: false,})
    // fastify.register(require('fastify-compress'), { global: true })
 

    const f  = fastify.register(fastifyStatic, {
        root,

    })

    fastify = wsRoute(io, fastify)
    //fastify.addHook('onRequest', imageOptimizeHook)

    fastify.get('/fitness',  async (req, reply) => {
        req.log.info('handling fitness request')
        return reply.sendFile('fitness.html')
    })

    fastify.get('/app/*',   async (req, reply) => {
        req.log.info('handling app request')
        console.log("GETTING APP")
        return reply.sendFile('app.html')
    })
    
    const rest = router(io)
    
    fastify.register(await rest, {prefix: '/api/v0.1'})


    try {
        await fastify.listen(io.config.http.port, io.config.http.host);

        fastify.blipp();

        console.info(`server listening on `, io.config.http.port);
    } catch (err) {

        console.error('Could not instantiate Fastify server', err)
    }

    return fastify
};


  