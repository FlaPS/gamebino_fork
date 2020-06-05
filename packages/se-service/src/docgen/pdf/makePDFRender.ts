import puppeteer, {Browser} from "puppeteer"

const prepare = async () => {
    const browser = await puppeteer.launch({ignoreHTTPSErrors: true, args: ['--no-sandbox']});
    //console.log('browser launched')
    return browser
}

export default (browser?: Browser) => {
    const browserPromise: Promise<Browser> = browser
        ? new Promise( resolve =>  resolve(browser))
        : prepare()

    return async (url: string) => {

        let page
        const start = new Date()
        let buffer: Buffer
        const browser = await browserPromise

        page = await browser.newPage()
        await page.goto(url, {waitUntil: 'networkidle0'})

        // @ts-ignore
        // console.log('internal page load', Number(new Date() - start))

        // page.pdf() is currently supported only in headless mode.
        // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
        await page.evaluate(() => {
            document.querySelectorAll('.blur').forEach( e => {
                // @ts-ignore
                e.style.filter = 'none'
                // @ts-ignore
                e.style.color = 'rgba(0,0,0,0)'
            })
        })

        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight)
        })

        buffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        })

        // @ts-ignore
        // console.log('internal pdf generation time', Number(new Date() - start))

        await page.close()

        return buffer
    }
}