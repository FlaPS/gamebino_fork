import configurable from './index'

const configurate = async cfg => {
    // tslint:disable-next-line:no-console
    console.log('Сonfigure:', cfg)
    return async (cfg) =>
        await new Promise( (resolve) =>
        {
            console.log('reconfigure', cfg)
        }
    )
}

const setUp = configurable(configurate)({
    param1: 8,
    nestedParams: {
        one: 1,
        two: 2,
    }
})('file-name')
