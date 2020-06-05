import gm from 'gm'
import path from "path"
import {FastifyRequest} from 'fastify'
const imagemin = require('imagemin')
const imageminWebp = require('imagemin-webp')


const root = path.join(__dirname, '..', '..', '..', 'se-mobile-front', 'public')
const logger = console
const fs = require('fs')

const getFileExtension = (filename) => {
    filename = filename.split('?')[0]
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export default async (request: FastifyRequest, reply, done) => {
    const url = request.req.url
    const ext = getFileExtension(url)

    request.query
    if(ext === 'webp') {
        logger.debug('looking for webp')

        const file = path.join(root, url)
        let result
        if (!fs.existsSync(file)) {
            logger.time('Converting image ' +  url)
            const name = file.split('.webp')[0]
            const pattern = name+'*.{jpg,png,JPG,PNG}'
            const destination = path.join(file, '..')
            const awaiter = await imagemin([pattern], destination, {
                use: [
                    imageminWebp({quality: 50})
                ]
            });
            logger.timeEnd('Converting image ' +  url )
            logger.debug('Convert '+url +', by pattern ' + pattern + ', to folder ' + destination)
            logger.log('file converted', awaiter[0].data)
            result = awaiter[0].data
        }
        else {
            result = fs.createReadStream(file)
        }
        logger.debug('Sending compressed file', file)


        reply.type('image/webp').send(result)
    }
}