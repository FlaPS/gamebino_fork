import fs from 'fs'
import path from 'path'

const templateFilePath = path.join(__dirname, '..', '..', '..', 'poker-ru-front', 'template', 'app.html.ts.ts')
const template = fs.readFileSync(templateFilePath, 'utf8')

const  getTemplate = (reloadTemplate: boolean) =>
    reloadTemplate
        ? fs.readFileSync(templateFilePath, 'utf8')
        : template

export default ({reloadTemplate} = {reloadTemplate: true}) =>
    (markup: string): string =>
        getTemplate(reloadTemplate)
                .split('Replaceable content')
                .join(markup)

