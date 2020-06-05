import {SEServiceConfig} from '../../../SEServiceConfig'
import path from 'path'
import {PDFResponse, RequestPDF} from './PDFIPC'


const childPath = path.join(__dirname, 'renderPDFWorker')
import {fork} from 'child_process'
import makePDFFile from "../makePDFRender"

let child: ReturnType<typeof fork>



export default (config: SEServiceConfig) =>  {


    if (!config.pdfWorkers) {
        const pdfMaker = makePDFFile()
        const processInMemory = (planId: string, docName: string, scheme: string) => {
                const url = config.frontendHost + '/api/v0.1/docgen/' + planId + '/' + docName + '.html?scheme=' + scheme + '&rand=' + Math.random()
                return pdfMaker(url)
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
