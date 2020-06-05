import Fastify from 'fastify'
import fs from 'fs'
import multer from 'fastify-multer'
import { SagaOptions } from '../sagas/SagaOptions'
import path from 'path'

const uploadsBaseDir = path.join('..', 'se-mobile-front', 'public', 'uploads')


export default (io: SagaOptions, fastify: Fastify.FastifyInstance) => {
    
    const storage = multer.diskStorage({

        destination: function (req, file, cb) {
            const userUploadsDir = path.join(uploadsBaseDir, req.params.userId)
            if (!fs.existsSync(userUploadsDir))
                fs.mkdirSync(userUploadsDir)

            cb(null, userUploadsDir)
        },
        filename: function (req, file, cb) {
            console.log('Uploaded started', req.params.fileName)
            cb(null, req.params.fileName )
        },
    })

    const upload = multer({ storage}).single('file')
    
    // @ts-ignore
    fastify.register(multer.contentParser)

    fastify.post('/uploadImage/:userId/:fileName', function(req, res) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.error(err)
                return res.status(500).send(err)
            } else if (err) {
                console.error(err)
                return res.status(500).send(err)
            }
            console.log('File uploaded Successfull')
            return res.status(200).send(req.file)
        })

    });
}