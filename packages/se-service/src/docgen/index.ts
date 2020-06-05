import {SEServiceState} from '../store/serviceDuck'
import pdfBulder from './pdf/'
import docFormats from './docFormats'
import htmlBuilder from './html/genHTML'
import {plansDuck} from 'se-iso/src/store/plansDuck'
import { SEServiceConfig } from '../SEServiceConfig'


export default (io: {config: SEServiceConfig}) => {

    const genPDF = pdfBulder(io)
    const genHTML = htmlBuilder(io)
    return async (
        state: SEServiceState,
        planId: string,
        docId: string,
        scheme: string = 'custom-0'
    ): Promise<{type: string, result: any}> => {
        const [docName, docFormat] = docId.split('.')

        //console.log(`Generate ${docFormat} ${docName} for planId=${planId}`)
        const plan = plansDuck.selectById(planId)(state)
        if(!plan)
            throw new Error("plan " + planId + " not found")
        //console.log('plan found', plan, 'scheme',  scheme || plan.scheme)

        if (docFormat === docFormats.PDF)
            return {
                type: 'application/pdf',
                result: await (genPDF(planId, docName, scheme || plan.scheme))
            }

        return {
            type: 'text/html',
            result: genHTML(state, plan, docName, scheme || plan.scheme)
        }

    }
}