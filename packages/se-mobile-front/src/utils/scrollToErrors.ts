import * as R from 'ramda'
import {scrollTo} from 'atomize'

export default (errors: any = {}) => {

    const hasError = !R.isEmpty(errors)

    if (hasError) {
        console.log('Errors', errors)
        const elId = Object.keys(errors)[0]
        console.log('scroll to ', elId)
        if(document.getElementById(elId))
            scrollTo('#' + elId, 100, 0, 800)
    }

    return hasError
}