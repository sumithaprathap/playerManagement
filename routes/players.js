var express = require('express')
var router = express.Router()
var pHandler = require('../public/javascripts/playersHandler')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index.html', { title: 'Express' })
})

/* lists all players. */
router.get('/players', function (req, res, next) {
  const list = pHandler.getAllPlayers()
  res.send(list)
})

/* creates new player. */
router.post('/players', function (req, res, next) {
  const d = pHandler.addPlayer(req.body)
  res.send(d)
})

/* get a player. */
router.get('/players/:id', function (req, res, next) {
  const pdata = pHandler.getPlayerDetails(req.params.id)
  if (req.session.playerData === undefined) {
    req.session.playerData = pdata
  }
  res.send(pdata)
})

/* deletes a player. */
router.delete('/players/:id', function (req, res, next) {
  const pdata = pHandler.deletePlayerDetails(req.params.id)
  res.send(pdata)
})

/* update a player. */
router.put('/players/:id', function (req, res, next) {
  const info = pHandler.updatePlayer(req.body)
  res.send(info)
})

/* verify Email Address */
router.post('/players/verify', function (req, res, next) {
  pHandler.verifyEmailAddress(req, res)
})

/* Send player details to Email Address */
router.post('/players/sendEmail', function (req, res, next) {
  pHandler.sendDataToEmailAddress(req, res)
})

module.exports = router
