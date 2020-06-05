import {SEBootstrap, default as Types} from './oldTypes'
import * as fs from "fs"
import {connect} from 'mongodb'
import * as R from 'ramda'

export default async (state: Types.SEBootstrap) => {
    state = state || JSON.parse(fs.readFileSync('./state.json', 'utf8'))
    const {users, plans, promoCodes} = state
    const db = (await connect('mongodb://localhost/smart-eat')).db()
    //const plans = db.collection('plans').find({}).project("state.ingridients")
    const getPlanStats = (prop = 'ingredients', sortValues = true) => {
        const map = sortValues ? {} : []
        plans.forEach(p => {
                let ing = p.profile[prop]
                if (Array.isArray(ing))
                    ing.forEach(i => {
                        map[i] = map[i] ? map[i] + 1 : 1
                    })
                else {
                    ing = Math.round(ing)
                    map[ing] = map[ing] ? map[ing] + 1 : 1
                }
            }
        )
        let ar = []

        if(sortValues) {
            ar = R.sortBy(R.prop('value'), ar)
            Object.keys(map).forEach(i => ar.push({name: i, value: map[i]}))
        } else {
            ar = map.map(i => ({name: i, value: map[i]}))
        }

        ar.map(obj => console.log(obj.name + ', ' + obj.value))
    }

    console.log('Ингридиенты')
    getPlanStats('ingredients', true)
    console.log(' ---')
    console.log('Возраст')
    getPlanStats('age', false)
    console.log(' ---')
    console.log('Вес')
    getPlanStats('weight', false)
    console.log(' ---')
    console.log('Рост')
    getPlanStats('height', false)
}
