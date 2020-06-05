import puppeteer from 'puppeteer'
import {ErrorPDF, RequestPDF, ResultPDF} from './PDFWorkerIPC'
import {getTimer} from '@sha/utils'
import makePDFFile from "../makePDFFile";

console.log('PDF WORKER STARTED')

process.on('uncaughtException', (err) => {
    console.log('whoops! There was an uncaught error', err);
    // do a graceful shutdown,
    // close the database connection etc.

});
process.on('unhandledRejection', (err) => {
    console.log('whoops! There was an uncaught error', err);
    // do a graceful shutdown,
    // close the database connection etc.

});


const pdfMaker = makePDFFile()

process.on('message', async ({planId, docName, url}: RequestPDF) => {
    const start = new Date()
    const id = '\n[ProcessPDF] planId = ' + planId + ' ' + docName + '\n'

    const log = (...args) => {
        console.log(id, '\ntime:'+getTimer(start)+ '\n', [...args])
    }


    try {
        const buffer = await pdfMaker(url)
        const msg: ResultPDF = {
            buffer: buffer,
            type: 'result',
            url,
        }
        //log('send result', buffer.length)
        process.send(msg)


    } catch(error) {
        const msg: ErrorPDF = {
            type: 'error',
            url,
            error,
        }
        log('send error')
        process.send(msg)


    }

})

