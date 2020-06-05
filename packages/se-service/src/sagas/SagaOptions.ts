import { SEServiceConfig } from '../SEServiceConfig'
import createMongoConnection from '../dataSources/createMongoConnection'
import {SEServiceState} from '../store/serviceDuck'
import {Store} from 'redux'
import eventStore from '../repositories/eventStore'
import UsersRepository from '../repositories/UsersRepository'
import PlansRepository from '../repositories/PlansRepository'
import PromosRepository from '../repositories/PromosRepo'
import CampaignsRepository from '../repositories/CampaignRepo'
import getBootstrapXSL from '../getBootstrap/'
import createMailer from '../mailer/createMailer'
import { ServiceStore } from '../store/configureServiceStore'
import log from '../logger'
import { Connection } from 'mongoose'



type ThenArg<T> = T extends Promise<infer U> ? U :
  T extends ((...args: any[]) => Promise<infer V>) ? V :
  T

export type SagaOptions = ThenArg<typeof sagaOptions>

export const sagaOptions = async (config: SEServiceConfig, store: ServiceStore/*, sockets: ReturnType<typeof WSBack>*/) => {
    const mongo = (await createMongoConnection(config.mongodb)).connection

    const options = {
        logger: log,
        config,
        mongo,
        store,
        eventStore: await eventStore(mongo),
        UsersRepo: await UsersRepository(mongo),
        PlansRepo: await PlansRepository(mongo),
        PromosRepo: await PromosRepository(mongo),
        CampaignsRepo: await CampaignsRepository(mongo),
        mailer: await createMailer({config, store}),
    }

    return options
    //sockets,
}

export default sagaOptions
