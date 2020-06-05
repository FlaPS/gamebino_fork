import pino from 'pino'

const log: pino.Logger = pino({ 
    level: 'debug',
    /*prettyPrint: { 
        colorize: true, 
        levelFirst: true,
        translateTime: true,
    },*/
    //prettifier: pretty as any,
})
//const consoleModule = log.child({module: 'console'})
//console.log = consoleModule.info
//console.warn = console.warn

export default log.child({module: 'se'})