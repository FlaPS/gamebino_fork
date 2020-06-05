'use strict'
import cfg from './migrate.json'
import configureServiceStore from "../store/configureServiceStore"
import createMongoConnection from '../dataSources/createMongoConnection'
import { PlanModel } from '../repositories/PlansRepository'
import UserRepository from '../repositories/UsersRepository'
import { PromoModel } from '../repositories/PromosRepo'
import { getPlanDigest } from 'se-iso'
import { defaultSEServiceConfig } from '../SEServiceConfig'
import {defaultPromoVO} from 'se-iso/src/store/promoCodesDuck'
import {PlanDoc} from 'se-iso/src/PlanSchema'
import getBootstrapXSL from '../getBootstrap'
import {quizDuck} from 'se-iso/src/store/quizDuck'
import {ingredientsDuck, recipesDuck} from 'se-iso/src'
import {usersDuck} from 'se-iso/src/store/usersDuck'

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


    let usersCount = 0
    const erroredUsers = []
    const userModel = UserRepository((await createMongoConnection(defaultSEServiceConfig.mongodb)).connection).Model
    const users = await userModel.find({}).select().lean()
    store.dispatch(usersDuck.actions.reseted(users))
    let plansCount = 0
    const state = store.getState()
    await PlanModel((await createMongoConnection({uri: cfg.prev})).connection).find({}).select("+_id").cursor().eachAsync(
        async (p: PlanDoc) => {

            const user = usersDuck.selectById(p.userId)(state)

            console.log('Check plan', p.planId, plansCount++)
            if(p.days.length === 1 && user && user.type === 'personal') {
                const digest = getPlanDigest(state.app.bootstrap, p.profile, 7)
                if(digest.daysIsValid) {
                    p.days = digest.days
                    console.log('Update plan', p.planId)


                    await p.save()
                }

            }
            //console.log(p.toJSON())



        },

    )

    done();
}

up(console.log).then(console.log)
/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
    done();
};

