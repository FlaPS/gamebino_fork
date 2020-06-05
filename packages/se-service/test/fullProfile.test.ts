import { expect } from 'chai'

import profile from '../src/repositories/FullProfile/index'
import { FullProfileVO } from '../src/repositories/FullProfile/index'
import mongoConnection from '../src/dataSources/createMongoConnection'

const fullProfile: FullProfileVO = {
  email: 'test@test.com',
  password: '1a1a1a1a',
  starredNewsIds: [1, 2],
  starredCurrenciesIds: [1, 2, 3],
  likedNewsIds: [1, 2],
  createdAt: Math.round((new Date('Wed Mar 20 2019 20:46:43 GMT+0300')).getTime () / 1000)
}

describe('ProfileVOtests', () => {
  let db
  beforeAll(async () => {
    db = (await mongoConnection).connection
  })

  it('Should create a user', function() {
    profile(db)
      .create(fullProfile)
      .then(user => {
        expect(user).to.deep.include(fullProfile)
      })
  })
  it('Should update the user', function() {
    profile(db)
      .updateById(Object.assign({}, fullProfile, { id: 5 }))
      .then(user => {
        expect(user).to.deep.include(Object.assign({}, fullProfile, { id: 5 }))
      })
  })
  it('Should update the user', function() {
    profile(db)
      .getById(5)
      .then(user => {
        expect(user).to.deep.include(Object.assign({}, fullProfile, { id: 5 }))
      })
  })
})
