const app = require('../app')
// 'supertest' required to test HTTP requests/responses
const request = require('supertest')

// player infos stored in json for now
var db = require('../public/json/db.json')

/* TEST lists all players. */
describe('GET /players ', () => {
  it('It should respond with an array of players objects', async () => {
    const response = await request(app).get('/players')
    expect(response.body).toEqual(db)
    expect(response.statusCode).toBe(200)
  })
})

/* TEST creates new player. */
describe('POST /players ', () => {
  it('It should create and respond with details of the added player', async () => {
    const nPlayersBeforeAdding = db.length
    const response = await request(app).post('/players').send({
      name: 'tester',
      isActive: true,
      points: 67,
      team: 'yellow'
    })
    expect(db.length).toBe(nPlayersBeforeAdding + 1)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('isActive')
    expect(response.body).toHaveProperty('points')
    expect(response.body).toHaveProperty('team')
    expect(response.statusCode).toBe(200)
  })
})

/* TEST get a player. */
describe('GET /players/:id ', () => {
  it('It should respond with details of the requested player', async () => {
    const response = await request(app).get('/players/:5c755ff9af458fde27863223')
    expect(db[0].length).toBe(response.body.length)
    expect(response.body.id).toBe('5c755ff9af458fde27863223')
    expect(response.body.name).toBe('Oneal Sims')
    expect(response.body.isActive).toBe(true)
    expect(response.body.points).toBe(52)
    expect(response.body.team).toBe('yellow')
    expect(response.statusCode).toBe(200)
  })
})

/* TEST deletes a non-existing player. */
describe('DELETE /players/:id ', () => {
  it('It should respond that the player details was not found', async () => {
    const nPlayersBeforecall = db.length
    const response = await request(app).delete('/players/:5c755ff9a1111fde27863223')
    expect(db.length).toBe(nPlayersBeforecall)
    expect(response.text).toEqual('player with id:5c755ff9a1111fde27863223 was not found.')
    expect(response.statusCode).toBe(200)
  })
})

/* TEST update a player. */
describe('PUT /players/:id ', () => {
  it('It should replace and respond witht he update success message', async () => {
    const response = await request(app).put('/players/:5c755ff9d107d51a8c59a816').send({
      id: '5c755ff9d107d51a8c59a816',
      isActive: false,
      points: 85,
      name: 'Maddox Craig',
      team: 'red'
    })

    expect(response.text).toEqual('Updated details of player with id:5c755ff9d107d51a8c59a816')
    expect(response.statusCode).toBe(200)
  })
})
