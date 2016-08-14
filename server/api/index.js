var express = require('express')
var router = express.Router()
router.use(express.static('../public'))

import env from './env'
import MongoHandler from './mongo/handler'

var availableRoutes = [
    '/lol'
]

router.get('/', (req, res) => {
    res.render('pages/api-entry', {
        routes: availableRoutes
    })
})

const internalServerError = 
    (res, source) => res.status(500).send({ error: `Error retrieving data from ${source}.` })
const badUserRequestError = 
    (res, param, route) => res.status(400).send({ name: param, error: `Invalid user request to ${route} API endpoint.`})

//api available request routes and responses
router.get(availableRoutes[0], (req, res) => {
    return res.send({ text: 'Say hello to the API world!' })
})

//nothing matched our api requests, return 404
router.get('*', (req, res) => { 
    return res.status(404).send({ error: 'Invalid API usage. Response not found.' }) 
})

module.exports = router