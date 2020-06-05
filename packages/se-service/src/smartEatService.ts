import {SEServiceConfig, findConfig} from './SEServiceConfig'
import configureServiceStore from './store/configureServiceStore'
import {seServiceSaga} from './sagas/seServiceSaga'
import log from './logger'


export default async (config?: SEServiceConfig) => {
    if (!config)
        config = await findConfig()

    const store = await configureServiceStore(config)
    log.info('Config')
    log.info(config)
    
    const rootSagaTask  = store.runSaga(seServiceSaga, store.options)
    
    return async () => {
        await new Promise(resolve =>
            log.info('close'),
        )
    }
}
