import {file} from 'googleapis/build/src/apis/file'

const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp')
import gm from 'gm'
import fs from 'fs'
import * as path from 'path'
import {imageSize} from 'image-size'
import {resultsAriaMessage} from 'react-select/src/accessibility'
const createTimer = (init = 0) => {
    const getTime = () => new Date().getTime()
    const start = getTime()
    return {
        elapsed : () =>  getTime() - start,
        getTime,
    }
}

const getFileWithoutExt = file => {
    const arr = file.split('.')
        arr.pop()
    return arr.join('')
}
const getFileExtension = (filename) => {
    filename = filename.split('?')[0]
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

const resize = (file, mult = 2) =>
    new Promise ( (resolve, reject) => {
            const dims = imageSize(file)
            const newPath = getFileWithoutExt(file) + '('+mult+').' + getFileExtension(file)
            if(fs.existsSync(newPath))
                resolve(newPath)
            gm(file)
                .resize(dims.width/mult, dims.height/mult)
                .write(newPath, function (err) {
                    if (!err) resolve(newPath)
                    else reject(err)
                });
        }
    )
const run = async (from: string, to: string, step = 100, offset = 0, skipFilesLevel = true) => {

    const files = fs.readdirSync(from).filter(file => getFileExtension(file).toLowerCase() !== '.svg')
    const convertedFiles = fs.readdirSync(to)
    const timer = createTimer()
    for(let i = 0; i < files.length; i++) {
        const sourceFile = path.join(from, files[i])
        console.log('resize file', sourceFile)
        try {
            await resize(sourceFile)
            console.log('   -> resized file', await resize(sourceFile))
        } catch (e){
            console.error('Error converting file', sourceFile, e)
        }
    }

    for (let i = offset; i < files.length; i += step) {

        const chunk = files
            .slice(i, i + step)
            .map ( fileName => from + '/' + fileName)
            .filter(file => getFileExtension(file) !== 'webp')
            .filter( file => !fs.existsSync(file))

        if (!skipFilesLevel)
            console.log(from + ' converting ' + chunk.length + ' files')

        const filesChunk = []
        for (let n = 0; n < chunk.length; n ++) {
            const file = chunk[n]
            if (fs.statSync(file).isDirectory()) {
                !fs.existsSync(path.join(to, files[i + n]).toString()) && fs.mkdirSync(path.join(to, files[i + n]).toString())
                console.log('isDirectory', chunk[n], path.join(from, files[i + n]), path.join(to, files[i + n]))
                await run(path.join(from, files[i + n]), path.join(to, files[i + n]), 1, 0, false)
            }
            else {
                const fileToSearchConverted = files[i + n].split('.').slice(0, -1).join('.') + '.webp'
                if(convertedFiles.indexOf(fileToSearchConverted) === -1)
                    filesChunk.push(file)
            }
        }

        console.log('files to convert', filesChunk.length)
        if (!skipFilesLevel)
            await imagemin(
                filesChunk,
                to,
                {
                    use: [
                        imageminWebp({method: 6})
                    ]
                })
        if (!skipFilesLevel) {
            console.log('Elapsed time', timer.elapsed())
            console.log('files covered ', i)
        }
    }
/*
    console.log('renameing the files')

    const outFiles = fs.readdirSync(to)
    const inFiles = fs.readdirSync(from)
    console.log(outFiles);

    for (let i=0; i<outFiles.length; i++) {
        const file = outFiles[i].split('.')[0]
        const inFile =inFiles.find(f => f.startsWith(file))
        const ext = inFile.split('.')[1]

        fs.renameSync(path.join(to, outFiles[i]), path.join(to, file+'.'+ext))
    }

 */
}

run(
    path.join(__dirname, 'public', 'tilda', 'images'),
    path.join(__dirname, 'public', 'tilda', 'images'),
    5,
    0,
    false,
)
    .then(() => console.log('all files converted'))