import puppeteer from 'puppeteer'
import {UserVO} from 'se-iso/src/store/usersDuck'
import {PlanVO} from 'se-iso/src'
import {Store} from 'redux'
import {SEServiceState} from '../../store/serviceDuck'
import {SEServiceConfig} from '../../SEServiceConfig'
import path from 'path'
import {PDFResponse, RequestPDF} from './ipc/PDFIPC'


const childPath = path.join(__dirname, 'renderPDFWorker')
import {fork} from 'child_process'
const util = require('util');
const exec = util.promisify(require('child_process').exec);
import { SagaOptions } from '../../sagas/SagaOptions'
import makePDFRender from './makePDFRender'

let child: ReturnType<typeof fork>



export default (io: {config: SEServiceConfig}) =>  {
    const config = io.config

    if (!config.pdfWorkers) {
        const pdfMaker = makePDFRender()
        const processInMemory = async (planId: string, docName: string, scheme: string) => {
            const url = config.frontendHost + '/api/v0.1/docgen/' + planId + '/' + docName + '.html?scheme=' + scheme


                /*const cliFile = path.join(__dirname, 'cli.js')
            const execString = 'node ' + cliFile + ' --url ' + url
            console.log('Execute ' + execString)
            const result = await exec(execString, {encoding: 'buffer'})*/
            const stdout = await pdfMaker(url)//result.stdout
            return stdout
        }
        return processInMemory
    }



    child = fork(childPath, [], {silent: false})

    return async (planId: string, docName: string, scheme: string) => {
        return await new Promise((resolve, reject) => {
                const url = config.frontendHost + '/api/v0.1/docgen/' + planId + '/' + docName + '.html?scheme=' + scheme + '&rand=' + Math.random()

                const request: RequestPDF = {
                    planId,
                    docName,
                    url,
                }
                const listener = (msg: PDFResponse) => {
                    if (msg.url === url) {
                        if (msg.type === 'error') {
                            reject(msg.error)
                            child.removeListener('message', listener)
                        } else {
                            resolve(new Buffer(msg.buffer))
                            child.removeListener('message', listener)
                        }

                    }
                }
                child.addListener('message', listener)

                child.send(request, (error) => {
                    if (error) {
                        console.log('send pdf request error', error, request)
                    }
                    console.log('send pdf request', request)
                })
            }
        )
    }

}
