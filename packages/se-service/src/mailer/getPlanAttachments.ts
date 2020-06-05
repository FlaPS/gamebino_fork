import makeDockgen from '../docgen'
import {SEServiceState} from '../store/serviceDuck'
import {plansDuck} from 'se-iso/src'
import {Attachment} from 'nodemailer/lib/mailer'

let docgen: ReturnType<typeof makeDockgen>

export default async (state: SEServiceState, planId: string ) =>  {
    if (!docgen)
        docgen = makeDockgen(state.app.bootstrap)

    const plan = plansDuck.selectById(planId)(state)

    const [menu, list, instruction, recipes] = await Promise.all([
        docgen(state, plan.planId, 'Menu.pdf'),
        docgen(state, plan.planId, 'ShoppingList.pdf'),
        docgen(state, plan.planId, 'Instruction.pdf'),
        docgen(state, plan.planId, 'Recipes.pdf'),
    ])

    const attachments: Attachment[] =  [
        {
            contentType: 'application/pdf',
            filename: 'Menu ' + plan.profile.fullName + '.pdf',
            content: (menu).result,


        },
        {
            contentType: 'application/pdf',
            filename: 'ShoppingList ' + plan.profile.fullName + '.pdf',
            content: (list).result
        },
        {
            contentType: 'application/pdf',
            filename: 'Instruction ' + plan.profile.fullName + '.pdf',
            content: (instruction).result
        },
        {
            contentType: 'application/pdf',
            filename: 'Recipes ' + plan.profile.fullName + '.pdf',
            content: (recipes).result
        },
    ]

    return attachments
}