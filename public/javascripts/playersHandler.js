var db = require('../../DB/json/db.json')
var path = require('path')
var AWS = require('aws-sdk')
AWS.config.loadFromPath(path.join(__dirname, '../../DB/json/config.json'))
AWS.config.region = 'us-east-1'
var SES = new AWS.SES()

module.exports = {
  getAllPlayers: function () {
    return db
  },

  addPlayer: function (info) {
    const id = this.getRandomeId()
    info.id = id
    if (info.isActive === 'true') { info.isActive = true } else { info.isActive = false }
    db.push(info)
    this.verifyEmailAddress()
    return info
  },

  getRandomeId: function () {
    let idString = '5c755ff9'
    var randomNumberBetween0and19 = 0
    while (idString.length < 24) {
      randomNumberBetween0and19 = Math.floor(Math.random() * 20)
      const hex = randomNumberBetween0and19.toString(16)
      idString = idString.concat(hex)
    }
    return idString
  },

  getPlayerDetails (id) {
    id = id.replace(/:/g, '')
    for (let i = 0; i < db.length; i++) {
      if (db[i].id === id) {
        console.log('object length is' + db[i].length)
        return db[i]
      }
    }
    return {}
  },

  deletePlayerDetails (id) {
    id = id.replace(/:/g, '')
    console.log('no. of elements before removing=' + db.length)
    let index
    for (let i = 0; i < db.length; i++) {
      if (db[i].id === id) {
        index = i
        break
      }
    }
    if (index !== undefined) {
      db.splice(index, 1)
      console.log('no. of elements after removing=' + db.length)
      return 'player with id:' + id + ' removed'
    } else {
      return 'player with id:' + id + ' was not found.'
    }
  },

  updatePlayer (updatedData) {
    let index
    for (let i = 0; i < db.length; i++) {
      if (db[i].id === updatedData.id) {
        index = i
        break
      }
    }
    if (index !== undefined) {
      db.splice(index, 1)
      if (updatedData.isActive === 'true') { updatedData.isActive = true } else { updatedData.isActive = false }
      db.push(updatedData)
      return 'Updated details of player with id:' + updatedData.id
    } else {
      return 'player with id:' + updatedData.id + ' was not found.'
    }
  },

  verifyEmailAddress: function (req, res) {
    var params = { EmailAddress: req.body.Email }
    SES.verifyEmailAddress(params, (err, data) => {
      if (err) { res.send(err) } else { res.send('Your Email has been verified.') }
    })
  },

  sendDataToEmailAddress: function (req, res) {
    let data = 'Player details not available'
    if (req.session.playerData) {
      data = req.session.playerData
    }
    const params = {
      Destination: {
        ToAddresses: [
          req.body.to
        ]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: 'Please find the player details as follows:' + JSON.stringify(data)
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Player details'
        }
      },
      Source: 'sumithaprathap@gmail.com'
    }
    console.log(JSON.stringify(params))
    SES.sendEmail(params, function (err, data) {
      console.log(err, data)
      res.send(JSON.stringify(data))
    })
  }

}
