const request = require('supertest')
const nock = require('nock')
const app = require('../src/main')

const BASE_URL = 'https://jsonplaceholder.typicode.com'

describe('POST /users/distance', () => {
  it('returns 400 when payload is invalid', async () => {
    const res = await request(app).post('/users/distance').send({})
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`)
  })

  it('returns user with distance when payload is valid', async () => {
    const remoteUser = {
      id: 1,
      name: 'John',
      address: {
        geo: { lat: '0', lng: '0' }
      }
    }

    nock(BASE_URL)
      .get('/users/1')
      .reply(200, remoteUser)

    const res = await request(app).post('/users/distance').send({ userId: 1, lat: 0, lng: 0 })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    if (res.body.distanceMeters !== 0) throw new Error('Expected distanceMeters to be 0')
    if (res.body.id !== 1) throw new Error('Expected returned user')
  })
})
