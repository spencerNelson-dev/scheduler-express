var express = require('express');
var router = express.Router();
const db = require('../../../db/mongoose')
const dbEvents = require('../../../models/eventsModel')

//Get all events
router.get('/all', function (req, res, next) {

    // send in the model that the database will use
    db.readAll(dbEvents)
        .then(response => {

            res.json(response)
        })
        .catch(error => {

            console.log(error)
            res.json(500)
        })
})

//Get event by id
router.get('/:id', function (req,res,next){

    let eventId = req.params.id

    db.readOne(eventId,dbEvents)
        .then(response => {

            res.json(response)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })
})

//POST - Create new event
router.post('/new', function (req,res,next){

    let newEvent = req.body

    db.create(newEvent, dbEvents)
        .then(response => {
            res.json(response)
        })
        .catch(error => {
            res.status(500).json(error)
        })
        .catch(err => {
            res.send(`Event was not created`)
        })
})

module.exports = router