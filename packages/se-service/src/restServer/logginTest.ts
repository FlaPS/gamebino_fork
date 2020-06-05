import Fastify from 'fastify'
import pino from 'pino'
const cuid = Math.random
const { createNamespace, getNamespace } = require('cls-hooked');

const logger = pino();
const loggerNamespace = createNamespace('logger');

const app = Fastify();

function clsRequestId(namespace, generateId) {
  return (req, res, next) => {
    const requestId = req.get('X-Request-Id') || generateId();
    res.set('X-Request-Id', requestId);

    namespace.run(() => {
      namespace.set('requestId', requestId);

      next();
    })
  }
}

app.use(clsRequestId(loggerNamespace, cuid));

app.get('/', async (req, res) => {
  const result = await handler();

  return res.send(result);
})

app.listen(4004, () => {
  logger.info(
    { endpoint: `http://localhost:4000` },
    'App is running!'
  )
})

function delay(timeoutMs) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, timeoutMs);
  })
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function handler() {
  const namespace = getNamespace('logger');

  logger.info({ requestId: namespace.get('requestId') }, 'Before')
  await delay(randomInteger(1000, 10000));
  logger.info({ requestId: namespace.get('requestId') }, 'Middle')
  await delay(randomInteger(1000, 10000));
  logger.info({ requestId: namespace.get('requestId') }, 'After')

  return {};
}