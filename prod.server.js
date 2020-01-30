const express = require('express')
const app = express()
const apiRoutes = express.Router()

const bodyParser = require('body-parser')
app.use(bodyParser.json())

apiRoutes.post('/user/login', (req, res) => {
  res.set({
    'x-auth-token': 'jfioefoqiflefjqoeifjqefjoqjfieqjfeijf'
  })
  res.json({
    code: 0
  })
})

apiRoutes.get('/user/logout_json', (req, res) => {
  res.json({
    code: 0
  })
})

apiRoutes.post('/apts/findAll', (req, res) => {
  res.json(require('./src/mock/json/apts_findAll'))
})

apiRoutes.post('/apts/getAptsInitiators', (req, res) => {
  res.json(require('./src/mock/json/apts_getAptsInitiators'))
})

apiRoutes.post('/apts/findOneByName', (req, res) => {
  res.json(require('./src/mock/json/apts_findOneByName'))
})

apiRoutes.post('/report/findAll', (req, res) => {
  res.json(require('./src/mock/json/report_findAll'))
})

apiRoutes.post('/procedures/getChartsByAPT', (req, res) => {
  res.json(require('./src/mock/json/getChartsByAPT(1)'))
})

apiRoutes.post('/report/search', (req, res) => {
  res.json(require('./src/mock/json/report_search'))
})

apiRoutes.get('/user/logout_json', (req, res) => {
  res.json({
    code: 0
  })
})

apiRoutes.get('/techniques/getTechTable', (req, res) => {
  res.json(require('./src/mock/json/techniques_getTechTable'))
})

app.use(apiRoutes)

app.use(express.static('./dist'))

var port = 3000

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
