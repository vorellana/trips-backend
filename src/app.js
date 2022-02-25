const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const config = require('../src/config');
const port = config.port; //QUITAR ESTO
// const strConnection = 'mongodb+srv://vorellana:Trips$2022@cluster0.ubpkb.mongodb.net/tripsdb'; // quitar esto
const strConnection = config.connectionDb;

// ***** connection to DB (MongoDB)*****
mongoose.connect(strConnection, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("**** Failed DB Connection ****");
        console.log(err);
    } else {
        console.log("**** Successful DB connection ****");
    }
})

// ***** settings *****
app.set('json spaces', 2);
app.use(express.json()); // to recognize json format
app.use(express.urlencoded({extended: false})); // to understand data from a form
app.use(cors());

// ***** routes *****
app.use(require('./routes/trips.routes'))

// ***** starting the server *****
app.listen(port, () => {
    console.log(`Server on port...`)
})

module.exports = app;