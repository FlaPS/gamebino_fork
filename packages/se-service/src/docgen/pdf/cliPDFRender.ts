import yargs from 'yargs'
import makePDFRender from './makePDFRender'
import fs from 'fs'

const {url, out} = yargs.options({
    url: {type: 'string', demandOption: true,alias: 'u'},
    out: {type: 'string', alias: 'o'},
}).argv


const main = async () => {
    console.log(url, out)
    const render = makePDFRender()
    const pdfFile = await render(url)

    if(out)
        fs.writeFileSync(out, pdfFile)

    else process.stdout.write(pdfFile)
}


main().then(() => process.exit())