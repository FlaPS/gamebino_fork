import newsFeedApi from '../src/newsFeed/newsFeedApi'
import Future, * as Fluture from 'fluture'
import {assert} from 'chai'
import { defaultNewsFeedRequest, NewsFeedRequest, NewsFeedResponse, NewsItemImpl } from '../src/newsFeed/newsFeedModel'
// import app from '../src/app'
import axios from 'axios'
import { encaseP } from 'fluture'
import createKnexConnection from '../src/dataSources/createKnexConnection'
import { SagaOptions } from '../src/sagas/SagaOptions'
import moment = require('moment')
import { object } from 'prop-types';
import console = require('console');
import { BTCEServiceConfig, defaultBTCEServiceConfig } from '../src/BTCEServiceConfig';
import configurable from '@sha/configurable'
const asyncTest = (name, routine) => it(name, async () => Fluture.go(routine).promise())

const assertEqual = Fluture.encase2(assert.equal)
const assertNotEqual = Fluture.encase2(assert.notEqual)
const assertDefined = Fluture.encase(assert.isDefined)
const assertIsEmpty = Fluture.encase(assert.isEmpty)

const gate = axios.create({baseURL: 'http://127.0.0.1:8001'})


describe('newsfeed test', () => {
  let api
  
  // let serverClose
  
  beforeAll( () => {
    return new Promise ( resolve => {
      configurable( async (config: BTCEServiceConfig) => {
          const knex = createKnexConnection()
          api = await newsFeedApi(knex)
          resolve()
          return async () => {}
        // serverClose = await app()
      })(defaultBTCEServiceConfig)('btce-sevice')
    }
  )
  })

  // afterAll( async () => await serverClose())


  test('2 x 2', () => {
      const testFactory = 2 * 2
      expect(testFactory).toBe(4)
  })

  asyncTest('Select newsFeed item by id', function* (){

    const item = yield api.getNewsItem({id: 1})
    yield assertDefined(item)
    // console.log(item)
  })

  asyncTest('Select newsFeed item with unreal id', function* (){
    /* try {
      const item = yield api.getNewsItem(999999999)
      console.log(item)
    } catch {
      console.log('not passed, ok')
    }
    */
  })

  asyncTest('Select newsFeed', function* () {
    const request: NewsFeedRequest = {
      limit: 9,
      search: ['Putin'],
    }
    const result = yield api.getNewsFeed(request)

    yield assertDefined(result)
    yield assertEqual(result.length, request.limit)
    // console.log(result.length)
  })
  
  asyncTest('request newsFeed with no params', function* () {
      const task = (req: NewsFeedRequest) =>
        Fluture
          .of(req)
          .chain(
            encaseP(
              (req) => gate.post<NewsFeedResponse>('/api/v0.2/feed/news', req),
            ),
          )

      const result = yield task({})

      yield assertDefined(result.data)
      yield assertEqual(result.data.result.length, 10)
  })

  asyncTest('request newsFeed with search query & id before', function* () {
    const task = (req: NewsFeedRequest) =>
      Fluture
        .of(req)
        .chain(
          encaseP(
            (req) => gate.post<NewsFeedResponse>('/api/v0.2/feed/news', req),
          ),
        )

    const result = yield task({limit: -20, search: ['bitcoin'], cursorId: 40000})

    // console.log(result)
    yield assertDefined(result)
  })

  asyncTest('request newsFeed with search query & id after', function* () {
    const task = (req: NewsFeedRequest) =>
      Fluture
        .of(req)
        .chain(
          encaseP(
            (req) => gate.post<NewsFeedResponse>('/api/v0.2/feed/news', req),
          ),
        )

    const result = yield task({limit: 20, search: ['bitcoin'], cursorId: 40000})

    // console.log(result)
    yield assertDefined(result)
  })

  asyncTest('request newsFeed with search query & pub_date earlier', function* () {
    const task = (req: NewsFeedRequest) =>
      Fluture
        .of(req)
        .chain(
          encaseP(
            (req) => gate.post<NewsFeedResponse>('/api/v0.2/feed/news', req),
          ),
        )

    const date = moment(new Date('2019 02 02'), 'YYYY MM DD')
    const result = yield task({limit: 5, search: ['eth'], cursorTimestamp: date.unix() })

    // console.log(result)
    yield assertDefined(result)
  })

  asyncTest('request newsFeed with search query & pub_date after', function* () {
    const task = (req: NewsFeedRequest) =>
      Fluture
        .of(req)
        .chain(
          encaseP(
            (req) => gate.post<NewsFeedResponse>('/api/v0.2/feed/news', req),
          ),
        )

    const date = moment(new Date('2019 02 02'), 'YYYY MM DD')
    const result = yield task({limit: -5, search: ['eth'], cursorTimestamp: date.unix() })

    // console.log(result)
    yield assertDefined(result)
  })

  asyncTest('Search news by categories', function* () {
    const task = (req: NewsFeedRequest) =>
      Fluture
        .of(req)
        .chain(
          encaseP(
            (req) => gate.post<NewsFeedResponse>('/api/v0.2/feed/news', req),
          ),
        )

    const date = moment(new Date('2019 02 02'), 'YYYY MM DD')
    const findOptions = {
      limit: -5,
      search: ['eth'],
      cursorTimestamp: date.unix(),
      categories: [1]
    }
    const result = yield task(findOptions)

    // console.log(result)
    yield assertDefined(result.data)
    for (let i = 0; i < result.data.result.length; i++) {
      yield assertNotEqual(result.data.result[i].categories.indexOf(findOptions.categories[0]), -1)
    };
  })
  asyncTest('Search news by currencies', function* () {
    const task = (req: NewsFeedRequest) =>
      Fluture
        .of(req)
        .chain(
          encaseP(
            (req) => gate.post<NewsFeedResponse>('/api/v0.2/feed/news', req),
          ),
        )

    const date = moment(new Date('2019 02 02'), 'YYYY MM DD')
    const findOptions = {
      limit: -5,
      search: ['eth'],
      cursorTimestamp: date.unix(),
      currencies: [1]
    }
    const result = yield task(findOptions)

    yield assertDefined(result.data)
    console.log(result.data)
    for (let i = 0; i < result.data.result.length; i++) {
      yield assertNotEqual(result.data.result[i].currencies.indexOf(findOptions.currencies[0]), -1)
    };
  })

  asyncTest('Search news by currencies and categories', function* () {
    const task = (req: NewsFeedRequest) =>
      Fluture
        .of(req)
        .chain(
          encaseP(
            (req) => gate.post<NewsFeedResponse>('/api/v0.2/feed/news', req),
          ),
        )

    const date = moment(new Date('2019 02 02'), 'YYYY MM DD')
    const findOptions = {
      // limit: -5,
      // search: ['eth'],
      // cursorTimestamp: date.unix(),
      currencies: [2536],
      categories: [9]
    }
    const result = yield task(findOptions)

    // console.log(result.data)
    yield assertDefined(result.data)
    for (let i = 0; i < result.data.result.length; i++) {
      yield assertNotEqual(result.data.result[i].currencies.indexOf(findOptions.currencies[0]), -1)
      yield assertNotEqual(result.data.result[i].categories.indexOf(findOptions.categories[0]), -1)
    };
  })
})
