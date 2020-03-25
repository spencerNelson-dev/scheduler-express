const mongoose = require('mongoose')
require('dotenv').config()

function schemaToArray(schema) {

    let rtnValue = []

    //console.log(schema)

    for (let key in schema){
        
        //TODO
        // Check for only the two properties that we want
        // by checking for class type Model and Schema

        rtnValue.push(schema[key])
    }

    return rtnValue
}

function connect(objConnect) {

    let uri = process.env.ATLAS_CONNECT_STRING

    console.log("Trying to connect")

    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "scheduler"
    })
    .catch(error => {
        console.log("failed to connect")
        console.log(error)
    })


} // end of function connect

// Close db
function close(){

    mongoose.connection.close()
}

// POST - Create event
function create(objCreate, schemaObj) {

    let [model, schema] = schemaToArray(schemaObj)

    let serial = {}

    //use the schema as a template to check for properties
    //in document to write if the documente has a matching
    //property copy it to new object write the new object
    for (let key in schema.obj){

        if(objCreate.doc.hasOwnProperty(key)){

            serial[key] = objCreate.doc[key]
        }
        
    }

    return model.create(serial)
}

// GET - Read One event
function readOne(objRead, schemaObj) {

    let [model, schema] = schemaToArray(schemaObj)
    
    return model.findById(objRead.id).exec()
}

// GET - Read All events
function readAll(schemaObj){

    let [model, schema] = schemaToArray(schemaObj)

    return model.find().exec()
}

// PATCH - Update
function update(objUpdate, schemaObj) {

    let [model, schema] = schemaToArray(schemaObj)

    let serial = {}

    //use the schema as a template to check for properties
    //in document to write if the documente has a matching
    //property copy it to new object write the new object
    for (let key in schema.obj){

        if(objUpdate.doc.hasOwnProperty(key)){

            serial[key] = objUpdate.doc[key]
        }
        
    }

    // {$set: serial} can also be passed as just serial as
    // mongoose will automatically put the atomic operator $set
    return model.updateOne({_id: objUpdate.id}, {$set: serial}).exec()
}

// can't use delete as a function name 
// because it is a js keyword
function del(objDelete, schemaObj) {

    let [model, schema] = schemaToArray(schemaObj)

    return model.deleteOne({_id: objDelete.id}).exec()
}

module.exports.connect = connect
module.exports.close = close
module.exports.create = create
module.exports.readOne = readOne
module.exports.readAll = readAll
module.exports.update = update
module.exports.del = del