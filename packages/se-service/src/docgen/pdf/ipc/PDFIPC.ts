export type RequestPDF = {

    planId: string
    docName: string
    url: string
}

export type PDFResponse = ResultPDF | ErrorPDF

export type ResultPDF = {
    type: 'result'
    buffer: Buffer
    url: string
}

export type ErrorPDF = {
    type: 'error'
    error: Error
    url: string
}