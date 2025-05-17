const request = require('supertest')
const nock = require('nock')
const app = require('../src/main')

const BASE_URL = 'https://jsonplaceholder.typicode.com'

describe('POST /users validation', () => {
  it('returns 400 when payload is invalid', async () => {
    const res = await request(app).post('/users').send({})
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`)
  })

  it('returns 201 when payload is valid', async () => {
    const validUser = {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496'
        }
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets'
      }
    }

    // Mock the remote service
    nock(BASE_URL)
      .post('/users', body => true)
      .reply(201, validUser)

    const res = await request(app).post('/users').send(validUser)
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
  })
})
