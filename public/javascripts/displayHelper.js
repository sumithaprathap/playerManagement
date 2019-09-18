function fetchData () {
  createMainDiv()
  document.getElementById('main').outerHTML = `<div id="list">
            <div class="wrap">
                <div class="left"></br>
                    <div id="playerform"></div>
                </div>
                <div class="right"></br>
                    <div id='table_div' height="200px" width="50%">
                </div>
            </div>
            </div>`

  $.ajax({
    url: 'http://localhost:3000/players',
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    // dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    data: {},
    success: function (data) {
      console.log('response=' + JSON.stringify(data))
      displayAllPlayers(data, 'table_div')
    },
    error: function (xhr, status) {
      console.log(status)
    }
  })
}

function displayAllPlayers (listOfPlayers, elemnt) {
  var data = new google.visualization.DataTable()
  data.addColumn('string', 'id')
  data.addColumn('boolean', 'isActive')
  data.addColumn('number', 'points')
  data.addColumn('string', 'name')
  data.addColumn('string', 'team')
  data.addRows(listOfPlayers.length)
  for (let i = 0; i < listOfPlayers.length; i++) {
    data.setCell(i, 0, listOfPlayers[i].id)
    data.setCell(i, 1, listOfPlayers[i].isActive)
    data.setCell(i, 2, listOfPlayers[i].points)
    data.setCell(i, 3, listOfPlayers[i].name)
    data.setCell(i, 4, listOfPlayers[i].team)
  }

  var table = new google.visualization.Table(document.getElementById(elemnt))

  table.draw(data, { alternatingRowStyle: true, showRowNumber: true, pageSize: 10, pagingButtons: 'auto', width: '100%', height: '100%' })
}

function createPlayerPage () {
  createMainDiv()
  document.getElementById('main').outerHTML = `<div id="create">
            <div class="wrap">
                <div class="left"></br>
                    <div class="form-group">
                        <label>name:</label>
                        <input type="text" class="inputtxt" value="" id="name">
                    </div>
                    <div class="form-group">
                        <label>isActive:</label>
                        <input type="text" list="states" class="inputtxt" value="" id="isActive">
                    </div>
                    <datalist id="states">
                        <option value=true>
                        <option value=false>
                    </datalist>
                    <div class="form-group">
                        <label>points:</label>
                        <input type="number" class="inputtxt" value="" id="points" min="1" max="100">
                    </div>
                    <div class="form-group">
                        <label>team:</label>
                        <input type="text" list="teams" class="inputtxt" value="" id="team">
                    </div>
                    <datalist id="teams">
                        <option value="red">
                        <option value="blue">
                        <option value="green">
                        <option value="yellow">
                    </datalist>
                </br><input value="Register Player" type="button" class="btn btn-primary" onclick="submitform()">
                    </div>
                <div class="right"></br>
                    </br><strong><div id="status" height="200px" width="50%"></div></div></strong>
                </div>
            </div>`
}

function submitform () {
  var formData = {}
  formData.name = document.getElementById('name').value
  formData.points = document.getElementById('points').value
  formData.team = document.getElementById('team').value
  if (document.getElementById('isActive').value === 'true') { formData.isActive = true } else { formData.isActive = false }

  $.ajax({
    url: 'http://localhost:3000/players',
    type: 'POST',
    crossDomain: true,
    // dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    data: formData,
    success: function (data) {
      console.log('response=' + JSON.stringify(data))
      document.getElementById('status').innerText = 'Player added with id: ' + data.id
    },
    error: function (xhr, status) {
      console.log(status)
    }
  })
}

function getPlayerPage () {
  createMainDiv()
  document.getElementById('main').outerHTML = `<div id="get">
                <div class="wrap">
                    <div class="left"></br>
                        <label>Enter the player's id:</label>
                        <input type="text" class="inputtxt" value="" id="getid">
                    </br><input value="Get player details" type="button" class="btn btn-primary" onclick="getPlayerDetails('getid', 'playerdata')">
                    </div>
                    <div class="right"></br>
                        </br><strong><div id="playerdata"  height="200px" width="50%"></div></strong>
                        </br><strong><div id="emaildata"  height="200px" width="50%"></div></strong>
                    </div>
                </div></div>`
}

function getPlayerDetails (idEl, dataEl) {
  // let playerid = document.getElementById("getid").value;
  const playerid = document.getElementById(idEl).value
  $.ajax({
    url: 'http://localhost:3000/players/' + ':' + playerid,
    type: 'GET',
    crossDomain: true,
    // dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    data: { id: playerid },
    success: function (data) {
      if (dataEl === 'updateplayerdata') { updatePlayerDetails(data, dataEl) } else { displayPlayerDetails(data, dataEl) }
    },
    error: function (xhr, status) {
      console.log(status)
    }
  })
}

function displayPlayerDetails (playerData, dataEl) {
  if (isEmpty(playerData)) {
    document.getElementById(dataEl).innerText = 'no player found.'
    return
  }

  var data = new google.visualization.DataTable()

  data = google.visualization.arrayToDataTable([
    ['id', 'isActive', 'points', 'name', 'team'],
    [playerData.id,
      playerData.isActive,
      playerData.points,
      playerData.name,
      playerData.team]
  ])

  var table = new google.visualization.Table(document.getElementById(dataEl))

  table.draw(data, { alternatingRowStyle: true, showRowNumber: true, pageSize: 10, pagingButtons: 'auto', width: '100%', height: '100%' })
  document.getElementById('emaildata').outerHTML = ` <label>Enter the Email id to receive the above details</label>
            <input type="text" class="inputtxt" value="" id="emailid"></br>
          </br><input value="Get player details" type="button" class="btn btn-primary" onclick="sendPlayerDetails('emailid', 'emaildata')">
          `
}

function deletePlayerPage () {
  createMainDiv()
  document.getElementById('main').outerHTML = `<div id="delete">
                <div class="wrap">
                    <div class="left"></br>
                        <label>Enter the id of the player you want to delete:</label>
                        <input type="text" class="inputtxt" value="" id="deleteid"></br>
                    </br><input value="Delete player details" type="button" class="btn btn-primary" onclick="deletePlayerDetails()">
                    </div>
                    <div class="right"></br>
                        </br><strong><div id="deleteplayerdata"  height="200px" width="50%"></div></strong>
                    </div>
                </div></div>`
}

function deletePlayerDetails () {
  const playerid = document.getElementById('deleteid').value
  $.ajax({
    url: 'http://localhost:3000/players/' + ':' + playerid,
    type: 'DELETE',
    crossDomain: true,
    // dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    data: { id: playerid },
    success: function (data) {
      document.getElementById('deleteplayerdata').innerText = data
    },
    error: function (xhr, status) {
      console.log(status)
    }
  })
}

function updatePlayerPage () {
  createMainDiv()
  document.getElementById('main').outerHTML = `<div id="update">
                <div class="wrap">
                    <div class="left"></br>
                        <label>Enter the player's id:</label>
                        <input type="text" class="inputtxt" value="" id="updateid">
                    </br><input value="Update player details" type="button" class="btn btn-primary" onclick="getPlayerDetails('updateid', 'updateplayerdata')">
                    </div>
                    <div class="right">
                        <br/><div id="updateplayerdata"  height="200px" width="50%"></div>
                        <br/><strong><div id='updatestatus'  height="200px" width="50%"></div></strong>
                </div></div></div>`
}

function updatePlayerDetails (data, dataEl) {
  if (isEmpty(data)) {
    document.getElementById(dataEl).innerText = 'no player found.'
    return
  }

  document.getElementById(dataEl).outerHTML = `</br><label>Please check the player's details below and update</label>
            <div class="form-group">
                <label>name:</label>
                <input type="text" class="inputtxt" value="" id="uname">
            </div>
            <div class="form-group">
                <label>isActive:</label>
                <input type="text" list="states" class="inputtxt" value="" id="uisActive">
            </div>
            <datalist id="states">
                <option value=true>
                <option value=false>
            </datalist>
            <div class="form-group">
                <label>points:</label>
                <input type="number" class="inputtxt" min="1" max="100" value="" id="upoints">
            </div>
            <div class="form-group">
                <label>team:</label>
                <input type="text" class="inputtxt" list="teams" value="" id="uteam">
            </div>
            <datalist id="teams">
                <option value="red">
                <option value="blue">
                <option value="green">
                <option value="yellow">
            </datalist>
        </br><input value="Update details" type="button" class="btn btn-primary" onclick="update('${data.id}')">`
  document.getElementById('uname').value = data.name
  document.getElementById('uisActive').value = data.isActive
  document.getElementById('upoints').value = data.points
  document.getElementById('uteam').value = data.team
}

function update (playerid) {
  var formData = {}
  formData.id = playerid
  formData.name = document.getElementById('uname').value
  formData.isActive = document.getElementById('uisActive').value
  formData.points = document.getElementById('upoints').value
  formData.team = document.getElementById('uteam').value

  $.ajax({
    url: 'http://localhost:3000/players/' + ':' + playerid,
    type: 'PUT',
    crossDomain: true,
    // dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    data: formData,
    success: function (data) {
      console.log('response=' + JSON.stringify(data))
      document.getElementById('updatestatus').innerText = data
    },
    error: function (xhr, status) {
      console.log(status)
    }
  })
}

function clearUnusedDiv () {
  if (document.getElementById('list') != undefined) {
    document.getElementById('list').remove()
  } else if (document.getElementById('create') != undefined) {
    document.getElementById('create').remove()
  } else if (document.getElementById('get') != undefined) {
    document.getElementById('get').remove()
  } else if (document.getElementById('update') != undefined) {
    document.getElementById('update').remove()
  } else if (document.getElementById('delete') != undefined) {
    document.getElementById('delete').remove()
  } else if (document.getElementById('verify') != undefined) {
    document.getElementById('verify').remove()
  }
}

function createMainDiv () {
  clearUnusedDiv()
  var d = document.createElement('div')
  d.setAttribute('id', 'main')
  document.body.appendChild(d)
}

function isEmpty (obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) { return false }
  }
  return true
}

function verifyPlayerPage () {
  createMainDiv()
  document.getElementById('main').outerHTML = `<div id="verify">
                <div class="wrap">
                    <div class="left"></br>
                        <label>Enter the Email address to verify</label>
                        <input type="text" class="inputtxt" value="" id="verifyid"></br>
                        </br><input value="Verify Email address" type="button" class="btn btn-primary" onclick="verifyEmail('verifyid', 'verifyData')">
                    </div>
                    <div class="right"></br>
                        </br><strong><div id="verifyData"  height="200px" width="50%"></div></strong>
                    </div>
                </div></div>`
}

function verifyEmail(idEl, dataEl) {
  const id = document.getElementById(idEl).value
  $.ajax({
    url: 'http://localhost:3000/players/verify',
    type: 'POST',
    crossDomain: true,
    // dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    data: { Email: id },
    success: function (data) {
      document.getElementById(dataEl).innerText = data
    },
    error: function (xhr, status) {
      console.log(status)
    }
  })
}

function sendPlayerDetails(idEl, dataEl) {
  const id = document.getElementById(idEl).value
  $.ajax({
    url: 'http://localhost:3000/players/sendEmail',
    type: 'POST',
    crossDomain: true,
    // dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    data: { to: id, body: 'player details here soon'},
    success: function (data) {
      document.getElementById(dataEl).innerText = data
    },
    error: function (xhr, status) {
      console.log(status)
    }
  })
}
