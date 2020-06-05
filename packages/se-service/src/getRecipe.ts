
import * as fs from 'fs'
import * as cheerio from 'cheerio'
import * as path from 'path'


const $ = cheerio.load(fs.readFileSync(path.join(__dirname,  './getBootstrap/CookBookFull.htm')))


export default (recipeTag: string) => {
    return  $('#' + recipeTag).html()
}

