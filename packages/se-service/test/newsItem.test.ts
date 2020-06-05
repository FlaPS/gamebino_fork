import { expect } from 'chai'

import NewsItemRepo from '../src/repositories/NewsItem/index'
import Future, * as Fluture from 'fluture'
import { NewsItemVO } from '../src/newsFeed/newsFeedModel'
import createKnexConnection from '../src/dataSources/createKnexConnection'

// import db from '../src/db'
import console = require('console');

const asyncTest = (name, routine) => it(name, async () => Fluture.go(routine).promise())

// const Equal = Fluture.encase2(expect)

const newsItemMock: NewsItemVO = {
  id: 1,
  name: 'bitcoinnews.com',
  link:
   'http://feedproxy.google.com/~r/Bitcoinnewscom/~3/YTqSMPCNCao/',
  hash: '21cac65105aa83c406eb4220f46d2d51',
  type: 0,
  title:
   '€3 Million Palazzo Mansion in Malta Can Only Be Purchased with Bitcoin',
  domain: 'bitcoinnews.com',
  content:
   'The EUR 3 million Palazzo mansion in Valletta, the capital of Malta, is being sold for Bitcoin only.\nThe current price tag of BTC 550 is unique since it would be the biggest crypto real estate transaction in Malta’s history, a nation which has been called Blockchain Island. Additionally, in the past large real estate deals that allowed Bitcoin also allowed fiat but this time, only Bitcoin is allowed.\nThe organizers of the sale of the Palazzo, CryptoHomes.io, are trying to specifically make a point that cryptocurrency is a good mechanism to conduct a real estate trade, which is why they are not accepting fiat. Dennis Avorin from CryptoHomes.io says, “Crypto is here to stay and we want to showcase that cryptocurrencies are not only commodities for speculators but also a means to purchase solid assets. Purchasing real estate with crypto is like purchasing real estate with fiat – the same due diligence and rules apply. We simply want to promote the use of crypto as a vehicle for solid investments and Malta is a great start with the incredibly strong real estate market that we have seen in the past few years. With the launch of Blockchain Island, we are certain that this trend will strengthen even further.”\nIndeed, cryptocurrency can be used like any other currency, like the USD or EUR, to purchase real estate, except with some advantages. Bitcoin can be transferred instantly, much faster than the typical long wait times when sending large amounts of fiat with a wire. Additionally, Bitcoin is cryptographically secure and can’t be hacked by even the most powerful supercomputer, which is a critical characteristic that ensures safety when dealing with such large amounts of money.\nOne downside is Bitcoin can be volatile, with fluctuations of 5-10% in a day being common. However, that can be remedied by using a service like BitPay which instantly converts the Bitcoin to fiat at the time of sale. This comes with a fee, however, and this can end up being substantial when transacting such large amounts of money.\nThis wouldn’t be the biggest Bitcoin real-estate transaction in history. That title goes to a 7-bedroom Miami mansion worth USD 6 million that was sold for 455 Bitcoins near the peak of the Bitcoin rally which saw Bitcoin hit USD 20,000. A mansion in Rome, the Palazzetto which is worth USD 44 million, is also being offered for Bitcoin but fiat is an option as well.\n \nFollow BitcoinNews.com on Twitter: @bitcoinnewscom\nTelegram Alerts from BitcoinNews.com: https://t.me/bconews\nWant to advertise or get published on BitcoinNews.com? – View our Media Kit PDF here.\nImage Courtesy: Pixabay\nThe post €3 Million Palazzo Mansion in Malta Can Only Be Purchased with Bitcoin appeared first on BitcoinNews.com.',
  pub_date: '2018-09-13T09:56:02.000Z',
  video_id: null,
  is_status: 1,
  created_at: '2018-09-13T10:09:06.000Z',
  votes_like: 0,
  properties: null,
  description:
   'The EUR 3 million Palazzo mansion in Valletta, the capital of Malta, is being sold for Bitcoin only. The current price tag of BTC 550 is unique since it would be the biggest crypto real estate transaction in Malta’s history, a nation which has been called Blockchain Island. Additionally, in the past large real estate deals …\nThe post €3 Million Palazzo Mansion in Malta Can Only Be Purchased with Bitcoin appeared first on BitcoinNews.com.',
  votes_funny: 0,
  votes_saved: 0,
  categorized: 1,
  votes_dislike: 0,
  votes_bearish: 0,
  votes_bullish: 0,
  votes_important: 0,
  root_comments_count: 0,
  categories: [],
  currencies: [],
}

const updateMock: Partial<NewsItemVO> = {
    id: 1,
    votes_like: 1,
}

describe(ProfileVOtests', () => {
  let NewsItem
  beforeAll(async () => {
    const knex = createKnexConnection()
    NewsItem = await NewsItemRepo(knex)
  })

  asyncTest('Select newsItem by id = 1', function* () {
    const item = yield NewsItem.getById(1)
    // console.log(item[0])
    expect(item[0])
  })

  asyncTest('Update newsItem by id = 1', function* () {
    yield NewsItem.update(updateMock)
    let item = yield NewsItem.getById(1)
    expect(item[0].votes_like).to.deep.equal(updateMock.votes_like)
    let restoreNews = Object.assign({}, updateMock, {votes_like: 0});
    yield NewsItem.update(restoreNews)
    item = yield NewsItem.getById(1)
    expect(item[0].votes_like).to.deep.equal(restoreNews.votes_like)
  })

  asyncTest('Inc likes newsItem', function* () {
    let item = yield NewsItem.getById(1)
    yield NewsItem.incrementLikes(1)
    let updatedItem = yield NewsItem.getById(1)
    expect(updatedItem[0].votes_like).to.deep.equal(item[0].votes_like + 1)
  })

  asyncTest('Dec likes newsItem', function* () {
    let item = yield NewsItem.getById(1)
    yield NewsItem.decrementLikes(1)
    let updatedItem = yield NewsItem.getById(1)
    expect(updatedItem[0].votes_like).to.deep.equal(item[0].votes_like - 1)
  })
  // it('Should get a news item with id = 1', async function() {
  //   let newsItem = NewsItemRepo(db).getById(1)
  //   newsItem.fork(console.error, console.log);
  //       // expect(newsItem).to.deep.include(fullProfile)
  // })
//   it('Should update the user', function() {
//     profile(db)
//       .updateById(Object.assign({}, fullProfile, { id: 5 }))
//       .then(user => {
//         expect(user).to.deep.include(Object.assign({}, fullProfile, { id: 5 }))
//       })
//   })
//   it('Should update the user', function() {
//     profile(db)
//       .getById(5)
//       .then(user => {
//         expect(user).to.deep.include(Object.assign({}, fullProfile, { id: 5 }))
//       })
//   })
})
