import {PlanDecorScheme} from 'se-iso/src/store/usersDuck'
import {useContext} from 'react'
import DecorContext from './DecorContext'

export default (bgProp: keyof PlanDecorScheme) => {
    const value = useContext(DecorContext)[bgProp]
    if(value) {
        //console.log('Apply bg', bgProp, value, 'url(' + value + ')')
        return {
            backgroundImage: 'url(' + value + ')',
            backgroundSize: 'cover'
        }
    }
    return {}
}