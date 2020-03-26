var express = require('express');
var router = express.Router();
const db = require('../../../db/mongoose')
const dbEvents = require('../../../models/eventsModel')
const dbPost = require('../../../db/postgres')

// //Get all events
// router.get('/allm', function (req, res, next) {

//     // send in the model that the database will use
//     db.readAll(dbEvents)
//         .then(response => {

//             res.json(response)
//         })
//         .catch(error => {

//             console.log(error)
//             res.json(500)
//         })
// })

// Get all events using postgresql
router.get('/all', function (req, res, next) {

    dbPost.query('SELECT * FROM events')
    .then(response => {

        res.json(response.rows)
    })
    .catch(error => {

        console.log(error)
        res.json(500)
    })
})

// get event by id postgresql
router.get('/:id', function (req, res, next) {    

    dbPost.query('SELECT * FROM events WHERE id=$1',[req.params.id])
    .then(response => {

        res.json(response.rows[0])
    })
    .catch(error => {

        console.log(error)
        res.json(500)
    })
})

// //Get event by id
// router.get('/:id', function (req, res, next) {

//     let eventId = req.params.id

//     db.readOne(eventId, dbEvents)
//         .then(response => {

//             res.json(response)
//         })
//         .catch(error => {
//             console.log(error)
//             res.status(500).json(error)
//         })
// })

//POST - Create new event pg
router.post('/new', function (req,res, next) {

    let newEvent = req.body

    let text = `INSERT INTO events (name, description, date, type) 
    values ($1, $2, $3, $4)`
    let values = [
        newEvent.name,
        newEvent.description,
        newEvent.date,
        newEvent.type
    ]

    dbPost.query(text, values)
    .then(result => {

        if(result.rowCount == 1){
            res.json(newEvent)
        }

        res.json(result)
    })
    .catch(error => {
        console.log(error)
    })
    
    
})

//POST - Create new event
// router.post('/new', function (req, res, next) {

//     let newEvent = req.body

//     db.create(newEvent, dbEvents)
//         .then(response => {
//             res.json(response)
//         })
//         .catch(error => {
//             res.status(500).json(error)
//         })
//         .catch(err => {
//             res.send(`Event was not created`)
//         })
// })

//DELETE - delete event by id
router.delete('/delete/:id', function (req, res, next) {

    dbPost.query("DELETE FROM events where id=$1",[req.params.id])
    .then(result => {

        if(result.rowCount ==1){
            res.json({})
        }

        res.send("no event found")
    })
    .catch(error => {

        console.log(error)
        res.json(500)
    })
})

//DELETE - Delete event by id
// router.delete('/delete/:id', async function (req, res, next) {

//     let eventId = req.params.id

//     try {

//         let foundUser = await db.readOne(eventId, dbEvents)

//         console.log(foundUser)

//         if (foundUser === null) {

//             throw new Error("No user with matching id was found")
//         } else {

//             await db.del(foundUser, dbEvents)

//             res.json({})
//         }

//     } catch (error) {

//         res.send(error)
//     }
// })

//Update event by id
router.patch('/update/:id', async function(req, res, next) {

    let oldEvent = await (await dbPost.query('SELECT * FROM events WHERE id=$1',[req.params.id])).rows[0]

    let changes = req.body

    if(oldEvent != undefined){

        for (let key in oldEvent){
            if(changes.hasOwnProperty(key)){

                oldEvent[key] = changes[key]
            }
        }

        dbPost.query(`UPDATE events
        SET name=$1, description=$2, date=$3, type=$4
        WHERE id=${req.params.id}`,
        [oldEvent.name, oldEvent.description, oldEvent.date, oldEvent.type])
        .then(result => {
            if(result.rowCount == 1){
                res.json(oldEvent)
            }
            res.json({})
        })
        .catch(error => {
            res.send(error)
        })
    }

})

//PATCH - update event by id
// router.patch('/update/:id', async function (req, res, next) {

//     // get the id from the params
//     let eventId = req.params.id

//     // get the sent changes from the body
//     let eventChanges = req.body

//     // add the id to the changes
//     eventChanges._id = eventId

//     try {

//         let response = await db.readOne(eventId, dbEvents)

//         if (response == null) {

//             throw new Error("Not Found")

//         } else {

//             // if found
//             await db.update(eventChanges, dbEvents)

//             res.json(await db.readOne(eventId, dbEvents))
//         }

//     } catch (error) {

//         console.log(error)
//         res.status(500).json(error)
//     }
// })

module.exports = router