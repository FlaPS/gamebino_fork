import smartEatService from './smartEatService'

smartEatService()
    .then( result => console.log('Service Stop', result))
    .catch( e => console.error('Service Error', e))
