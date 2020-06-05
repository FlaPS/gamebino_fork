'use strict'
import cfg from './migrate.json'
import configureServiceStore from "../store/configureServiceStore"
import createMongoConnection from '../dataSources/createMongoConnection'
import { PlanModel } from '../repositories/PlansRepository'
import UserRepository from '../repositories/UsersRepository'
import {PromoModel} from '../repositories/PromosRepo'
import { drainPlanDays, getPlanDigest, PlanVO } from 'se-iso'
import { defaultSEServiceConfig } from '../SEServiceConfig'
import {defaultPromoVO} from 'se-iso/src/store/promoCodesDuck'
import {PlanDoc} from 'se-iso/src/PlanSchema'
import getBootstrapXSL from '../getBootstrap'
import {quizDuck} from 'se-iso/src/store/quizDuck'
import {ingredientsDuck, recipesDuck} from 'se-iso/src'

/**
 * Make any changes you need to make to the database here
 */
export const up = async (done) => {

    const store = await configureServiceStore(defaultSEServiceConfig)

    const directory = await getBootstrapXSL()
    store.dispatch(quizDuck.actions.reseted(directory.quiz))
    store.dispatch(ingredientsDuck.actions.reseted(directory.ingredients))
    store.dispatch(recipesDuck.actions.reseted(directory.recipes))

    const nextPlanModel = PlanModel((await createMongoConnection(defaultSEServiceConfig.mongodb)).connection)
    const state = store.getState()

    let usersCount = 0
    const erroredUsers = []
    const userModel = UserRepository((await createMongoConnection(defaultSEServiceConfig.mongodb)).connection).Model
    await userModel.find({}).select("+_id").cursor().eachAsync( async (u) => {

        if (u.state) {

        }
            u.createdAt = u._id.getTimestamp()
            u.updatedAt = u._id.getTimestamp()
            console.log('Replace user', u.userId, usersCount++)

            await u.save()

        //await userModel.replaceOne({userId: u.userId}, (u))

    }, {parallel: 10}
  )

    let plansCount = 0
    await PlanModel((await createMongoConnection({uri: cfg.prev})).connection).find({}).select("+_id").cursor().eachAsync(
        async (p: PlanDoc) => {

            if(p.state) {
                p.userId = p.state.ownerId
                p.days = p.state.days || []
                p.isPayed = p.state.isPayed
                p.profile = p.state.profile
                p.isPayedByClient = p.state.isPayedByClient
                p.state = undefined
                //p.state
                //console.log('drained', JSON.stringify(drainPlan, true, 4))
            }

            p.createdAt = p._id.getTimestamp()
            p.updatedAt = p._id.getTimestamp()
            p.paidAt = p.orderTimestamp
            p.isDemo = undefined
            p.isPersonalPlan = undefined
            if(!p.days || p.days.length === 0) {
                const days = getPlanDigest(state.app.bootstrap, p.profile, p.isPayed ? 28 : 1).days
                p.days = days
            }
            //console.log(p.toJSON())

            console.log('Replace plan', p.planId, plansCount++)
            await p.save()

        },
        {parallel: 100}

    )


  console.log("Replacing promos")
  const promoModel = PromoModel((await createMongoConnection(defaultSEServiceConfig.mongodb)).connection)
  await promoModel.find({}).lean().cursor().eachAsync( async (p) => {
        if (p.state) {
          console.log('Replace promo', p.state.promoId)
            const promo = {
                ...defaultPromoVO,
                promoId: p.state.promocodeId,
                activations: p.state.activations,
                promoCode: p.state.promocodeString,
            }

            await promoModel.remove({id: p.id})
          //await planModel.replaceOne({planId: p.planId},p.state)
            await promoModel.create(promo)
        }
      }
  )

    console.log('problem users', erroredUsers)

  //let r  = await db.replaceOne({planId: item.planId}, item.state)
  /*console.log(items.length)
  
  const rawPlan = items[6]
  console.log('item', rawPlan)
 
  console.log(drainPlan)
/*
  for(let i = 0; i < items.length; i++){
    await replaceOne({planId: item.planId}, item.state).then(() => console.log(i, 'of',l))
  }
      */
  /*
  const rawPlan = state.app.plans[6]
  const drainPlan = plansDuck.selectFullPlanById(rawPlan.planId)({app:{bootstrap: state.app}})
  console.log(drainPlan)
  console.log(JSON.stringify(state.app.plans[6], true,  4 ))*/

  done();
}

up(console.log).then(console.log)
/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};

