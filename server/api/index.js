var express = require('express')
var bodyParser = require('body-parser')
var router = express.Router()

router.use(express.static('public'))
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

import env from './env'
import AirtableHandler from './airtable/handler'

var availableRoutes = [
    {
        routename: '/roster',
        methods: ["GET"],
        description: "Gets the current Raagapella team, their voice parts, and their images."
    },
    {
        routename: '/auditions',
        methods: ["GET", "PUT"],
        description: "Lists all the auditions, and allows adding of people."
    },
    {
        routename: '/callbacks',
        methods: ["GET", "PUT"],
        description: "Lists all the callbacks, and allows adding of people."
    },
    {
        routename: '/events',
        methods: ["GET"],
        description: "Gets up to three of the most upcoming events."
    }
]

router.get('/', (req, res) => {
    res.render('pages/api-entry', {
        routes: availableRoutes
    })
})

const internalServerError = 
    (res, reason, source = "Airtable") => res.status(500).send({ error: `Error retrieving data from ${source}.`, reason: reason })
const badUserRequestError = 
    (res, reason) => res.status(400).send({ error: `Invalid user request to ${route} API endpoint.`, reason: reason })

router.get(availableRoutes[0].routename, (req, res) => {
    AirtableHandler.getRoster()
    .then(people => res.send(people))
    .catch(e => internalServerError(res, e))
})

//api available request routes and responses
router.get(availableRoutes[1].routename, (req, res) => {
    AirtableHandler.getAuditions()
    .then(auditions => res.send(auditions))
    .catch(e => internalServerError(res, e))
})

router.put(availableRoutes[1].routename, (req, res) => {
    if (!(req.body) || Object.keys(req.body).length == 0) 
        return ErrorResponse.badUserRequestError(res, availableRoutes[1].routename, "Empty PUT request")
    AirtableHandler.registerAudition(req.body.id, req.body.name, req.body.email, req.body.references)
    .then(audition => res.send(audition))
    .catch(e => internalServerError(res, e))
})

router.get(availableRoutes[2].routename, (req, res) => {
    AirtableHandler.getCallbacks()
    .then(callbacks => res.send(callbacks))
    .catch(e => internalServerError(res, e))
})

router.put(availableRoutes[2].routename, (req, res) => {
    if (!(req.body) || Object.keys(req.body).length == 0) 
        return ErrorResponse.badUserRequestError(res, availableRoutes[2].routename, "Empty PUT request")
    AirtableHandler.registerCallback(req.body.id, req.body.name, req.body.email)
    .then(callbackObject => res.send(callbackObject))
    .catch(e => internalServerError(res, e))
})

router.get(availableRoutes[3].routename, (req, res) => {
    AirtableHandler.getEvents()
    .then(people => res.send(people))
    .catch(e => internalServerError(res, e))
})

//nothing matched our api requests, return 404
router.get('*', (req, res) => res.status(404).send({ error: 'Invalid API usage. Response not found.' }))

module.exports = router