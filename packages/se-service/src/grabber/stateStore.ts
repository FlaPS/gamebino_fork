import {getPlanDigest, PlanVO, SEBootstrap} from 'se-iso/src'
import {usersDuck, UserVO} from 'se-iso/src/store/usersDuck'
import * as R from 'ramda'
import fetch from 'cross-fetch'

const fileName = 'state2.json'
function postData(url = '', data = {}) {
    // Значения по умолчанию обозначены знаком *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    })
        .then(response => response.json()); // парсит JSON ответ в Javascript объект
}

import fs from 'fs'

const save = (source: Partial<SEBootstrap>) => {
    const data = JSON.stringify(source, null, 4)
    console.log('state file size', data.length)
    fs.writeFileSync('./'+fileName, data)
}

const fetchAdminState = (): Promise<SEBootstrap> =>
    postData('https://smart-eat.ru/api/v0.1/fetchAdminState', {answer: 42})

const fetchUsers = (): Promise<UserVO[]> =>
    postData('https://smart-eat.ru/api/v0.1/fetchUsers', {answer: 42})

const fetchPlansByUserId = (payload: {userId: string}): Promise<PlanVO[]> =>
     postData('https://smart-eat.ru/api/v0.1/fetchPlansByUserId', payload)
const pushCommands = (arr: any[]): Promise<any[]> =>
    postData('https://smart-eat.ru/api/v0.1/pushCommands', arr)

const run = async () => {
    const db = await fetchAdminState()

    const users = await fetchUsers()
    let plans: PlanVO[] = []

    let i = 0;
    while( i < users.length + 5) {
        console.log('fetching plans for chunk', i/10)
        const chunk = R.slice(i, i + 10, users).map( u => fetchPlansByUserId({userId: u.userId}))
        const result = await Promise.all(chunk)
        result.forEach( list =>
            plans = R.concat(plans, list)
        )
        console.log('totalPlans', plans.length )
        i += 10
    }

    const state = {
        ...db,
        users,
        plans,
    }
    console.log('total users', users.length)
    console.log('total plans', plans.length)
    save(state)


}


// run().then(() => console.log('Completed!'))
import {plansDuck} from 'se-iso/src/store/plansDuck'
import createMailer from '../mailer/createMailer'


const check = async ()=> {
    const state:SEBootstrap = JSON.parse(fs.readFileSync('./'+fileName, 'utf8'))

    console.log('config', state.config)
    const mailer = await createMailer(state.config)
    const start = 1580342400000;
    const end = 1580515200000;

    const users = state.users.filter( u =>
        u.registrationTimestamp > start &&
        u.registrationTimestamp < end
    )

    const plans = users.map( u =>
            R.sortBy(R.prop('creationTimestamp'), state.plans.filter(p => p.userId === u.userId))[0]
    )

    console.log(plans.length, users.length)

    const sendMail = async (i) => {
        const plan = plans[i]
        const user = users[i]
        if (plan) {
            console.log('sending ', i, user.email)

            try {
                await mailer.demoPlanAfterRegister(user, plan, {app: state})
            } catch (e) {
                console.log('Error in sending', i, 'to mail', user.email, e)
            }
        }
    }

    var i = 46;
    while( i < users.length) {
        await Promise.all([sendMail(i), sendMail(i+1), sendMail(i+2)])
        //
        i+=3
    }


    console.log('finish on', i)
    //console.log(users[0])
    //console.log(plans[0])



   //

/*
    const users: UserVO[] = usersToAddByPlans.map ( (p: Plan): UserVO => {

        if(p.profile.fullName.startsWith('Ара')) {
            console.log(p)
        }
        return {
            ...p.profile,
            registrationTimestamp: p.creationTimestamp,
            userId: p.userId,
            password: generatePassword(),
            type: 'personal',
            planDecor: {
                customSchemes: [],
                brandSchemes: [],
            },
            balance: 0,
            clientsType: "offline",
            verify: 'unset',
            verifyDocs: [],
            trainerData: {
                displayNames:[{timestamp: p.creationTimestamp, value: p.userId}],
                approved: 'unset',
                approveTimestamp: undefined,
                backgroundImage: undefined,
                description: '',
            },
            banned: false,
            isTrainer: false,
            transactions: [],

            emailIsConfirmed: undefined
        } as any
    })
*/

}
check()
