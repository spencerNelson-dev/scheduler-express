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
router.get('/:id', function (req, res, next) {

    let eventId = req.params.id

    db.readOne(eventId, dbEvents)
        .then(response => {

            res.json(response)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json(error)
        })
})

//POST - Create new event
router.post('/new', function (req, res, next) {

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

//DELETE - Delete event by id
router.delete('/delete/:id', async function (req, res, next) {

    let eventId = req.params.id

    try {

        let foundUser = await db.readOne(eventId, dbEvents)

        console.log(foundUser)

        if (foundUser === null) {

            throw new Error("No user with matching id was found")
        } else {

            await db.del(foundUser, dbEvents)

            res.json({})
        }

    } catch (error) {

        res.send(error)
    }
})

//PATCH - update event by id
router.patch('/update/:id', async function (req, res, next) {

    // get the id from the params
    let eventId = req.params.id

    // get the sent changes from the body
    let eventChanges = req.body

    // add the id to the changes
    eventChanges._id = eventId

    try {

        let response = await db.readOne(eventId, dbEvents)

        if (response == null) {

            throw new Error("Not Found")

        } else {

            // if found
            await db.update(eventChanges, dbEvents)

            res.json(await db.readOne(eventId, dbEvents))
        }

    } catch (error) {

        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router