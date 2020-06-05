import { newsFeedApi } from '../src/newsFeed/newsFeedApi'
import Future, * as Fluture from 'fluture'
import {assert} from 'chai'
import { defaultNewsFeedRequest, NewsFeedRequest, NewsFeedResponse, NewsItemImpl } from '../src/newsFeed/newsFeedModel'
import app from '../src/btceService'
import axios from 'axios'
import { currencyApi } from '../src/currency/currencyApi'

const asyncTest = (name, routine) => it(name, async () => Fluture.go(routine).promise())

const assertEqual = Fluture.encase2(assert.equal)
const assertDefined = Fluture.encase(assert.isDefined)
const assertIsEmpty = Fluture.encase(assert.isEmpty)

const gate = axios.create({baseURL: 'http://127.0.0.1:8000'})

describe('currencies test', async () => {

  const api = currencyApi

  let serverClose

  beforeAll( async () => {
      serverClose = await app()
    },
  )

  afterAll( async () => await serverClose())

  test('2 x 2', () => {
    const testFactory = 2 * 2
    expect(testFactory).toBe(4)
  })

  asyncTest('Select all currencies', function*() {
    const future = api.list
    const response = yield future
    yield assertDefined(response)
    console.log(response)
  })
})
