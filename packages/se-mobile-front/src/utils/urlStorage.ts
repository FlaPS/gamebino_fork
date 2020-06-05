import {history} from '../history'

const getParams = () =>
    new URLSearchParams(history.location.search)

const saveParams = (params) =>
    history.push({
        search: '?' + params.toString()
    })

export default {
    setItem: <T = any>(key: string, value: T) => {
        const params = getParams()
        params.delete(key)
        if(value!==undefined)
            params.set(key, JSON.stringify(value))
        saveParams(params)
    },

    getItem: <T = any>(key: string, defaultValue?: T): T | undefined => {
        const params = getParams()
        let result: T = defaultValue
        try {
            const item = params.get(key)
            if (item) {
                result = JSON.parse(item)
            }

        } catch(e) {
            console.error('Error while access URLParams storage with key', key, e)
        }

        return result
    }
}