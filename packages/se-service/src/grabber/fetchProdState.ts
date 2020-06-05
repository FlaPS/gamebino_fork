import {SEBootstrap, Plan} from './oldTypes'
import fetch from 'cross-fetch'
export function postData(url = '', data = {}) {
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
        referr: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    })
        .then(response => response.json()); // парсит JSON ответ в Javascript объект
}

import fs from 'fs'
import * as Ex from './oldTypes'
import {PlanVO} from 'se-iso/src'
import * as R from 'ramda'
export const save = (source: Partial<SEBootstrap>, fileName = 'state.json') => {
    const data = JSON.stringify(source, null, 4)
    console.log('save file state file size', data.length)
    fs.writeFileSync('./'+fileName, data)
}

export const fetchAdminState = (): Promise<SEBootstrap> =>
    postData('https://smart-eat.ru/api/v0.1/fetchAdminState', {answer: 42})

export const fetchUsers = (): Promise<Ex.UserVO[]> =>
    postData('https://smart-eat.ru/api/v0.1/fetchUsers', {answer: 42})

export const fetchPlansByUserId = (payload: {userId: string}): Promise<Ex.Plan[]> =>
    postData('https://smart-eat.ru/api/v0.1/fetchPlansByUserId', payload)

export const pushCommands = (arr: any[]): Promise<any[]> =>
    postData('https://smart-eat.ru/api/v0.1/pushCommands', arr)


export const fetchProdState = async () => {
    const db: SEBootstrap = await fetchAdminState()

    const users = await fetchUsers()
    let plans: Plan[] = []

    let i = 0;
    while( i < users.length + 5) {
        console.log('fetching plans for chunk', i/10)
        const chunk = R.slice(i, i + 10, users).map( u => fetchPlansByUserId({userId: u.userId}))
        const result = await Promise.all(chunk)
        result.forEach( list =>
            plans = R.concat(plans, list)
        )
        console.log('plans loaded', plans.length )
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

    return state

}
