var express = require('express');
var router = express.Router();
const db = require('../../../db/mongoose')
const dbevents = require('../../../models/eventsModel')

//Get all events
router.get('/all', function (req, res, next) {

    // send in the model that the database will use
    db.readAll(dbevents)
        .then(response => {

            res.json(response)
        })
        .catch(error => {

            console.log(error)
            res.json(500)
        })
})

module.exports = router