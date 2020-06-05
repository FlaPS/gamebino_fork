

import ReactDOMServer from 'react-dom/server'
import React from 'react'
import {SEServiceState} from '../../store/serviceDuck'
import MenuReact from './MenuReact'
import InstructionReact from './InstructionReact'
import ShoppingList from './ShoppingListReact'
import CookInfoReact from './CookInfoReact'
import docTypes from '../docTypes'
import {
    FullPlan,
    PlanVO,
} from 'se-iso/src'
import DecorContext from './DecorContext'
import {PlanDecorScheme, usersDuck} from 'se-iso/src/store/usersDuck'
import { plansDuck } from 'se-iso/src/store/plansDuck'
import { SagaOptions } from '../../sagas/SagaOptions'

const bgRoot = '/assets/exampledocs/4a_standart/menu/'

export default (io: SagaOptions) =>  
    (state: SEServiceState, plan: FullPlan, docType: string, scheme: string = 'custom-0') => {

    const user = usersDuck.selectById(plan.userId)(state)

    const schemeIndex = (scheme || '').split('-')[1]
    const schemeType = (scheme || '').split('-')[0]

    let schemeObj: Partial<PlanDecorScheme> = {}

    if(schemeType === 'custom')
        schemeObj = (user.planDecor && user.planDecor.customSchemes && user.planDecor.customSchemes[schemeIndex]) || {}
    else if(schemeType === 'brand')
        schemeObj = user.planDecor.brandSchemes[schemeIndex]

    //console.log('scheme name', scheme, 'scheme obj', schemeObj)
    let Component = MenuReact

    if(docType === docTypes.shoppingList)
        Component = ShoppingList

    if(docType === docTypes.instruction)
        Component = InstructionReact

    if(docType === docTypes.cookInfo)
        Component = CookInfoReact


    schemeObj = {...schemeObj}

    if(schemeObj.bgSet === 'none') {
        schemeObj.menuBg = '/blank.jpg'
        schemeObj.coverBg = '/blank.jpg'
        schemeObj.instructionBg = '/blank.jpg'
        schemeObj.recipesBg = '/blank.jpg'
        schemeObj.shoppingListBg = '/blank.jpg'

    } else if(schemeObj.bgSet !== 'default') {
              } else {
            schemeObj.menuBg = bgRoot + 'trainer_default.jpg'
            schemeObj.coverBg = bgRoot + 'trainer_cover.jpg'
            schemeObj.instructionBg = bgRoot + 'trainer_default.jpg'
            schemeObj.recipesBg =  bgRoot + 'trainer_default.jpg'
            schemeObj.shoppingListBg = bgRoot + 'trainer_default.jpg'
    }

    if (!schemeObj.bgSet) {
        schemeObj.menuBg = bgRoot + 'trainer_default.jpg'
        schemeObj.coverBg = bgRoot + 'trainer_cover.jpg'
        schemeObj.instructionBg = bgRoot + 'trainer_default.jpg'
        schemeObj.recipesBg =  bgRoot + 'trainer_default.jpg'
        schemeObj.shoppingListBg = bgRoot + 'trainer_default.jpg'
    }
    
    if (user.type === 'personal') {
        schemeObj.menuBg = bgRoot + 'service_default.jpg'
        schemeObj.coverBg = bgRoot + 'service_cover.jpg'
        schemeObj.instructionBg = bgRoot + 'service_default.jpg'
        schemeObj.recipesBg =  bgRoot + 'service_default.jpg'
        schemeObj.shoppingListBg = bgRoot + 'service_list.jpg'
    }


    const fullPlan = plansDuck.selectFullPlan(plan)(state)
    io.logger.debug('Plan decor sheme', schemeObj)
    //console.log('rendering doc with scheme', schemeObj)
    const div = ReactDOMServer.renderToString(
        <DecorContext.Provider value={schemeObj}>
            <Component
                state={state}
                plan={
                    fullPlan
                }
                scheme={scheme} 
                />
        </DecorContext.Provider>
    )

    const result = "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "\n" +
        `
            <head>
              <meta charset="utf-8">
              <title>A4</title>
              <!--Normalize or reset CSS with your favorite library -->
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css">
              <link rel="stylesheet" href="/assets/exampledocs/4a_standart/style.css">
            </head>
            <body >\n
                ${div}
            </body>

        </html>`

    return result

}
