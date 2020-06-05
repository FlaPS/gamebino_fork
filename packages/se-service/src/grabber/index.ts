import {fetchProdState} from './fetchProdState'
import insertViewsToMongo from './insertViewsToMongo'
const log = console.log


const run = async () => {
    // log('Fetch prod state')
    //const prodServerState = await fetchProdState()

    //log('insert views in mongo')
    //await insertViewsToMongo(prodServerState)
}

run().then(() => console.log('done'))
