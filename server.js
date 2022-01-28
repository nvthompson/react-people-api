//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const res = require('express/lib/response');

//intialize express app
const app = express();

//configure server settings
require('dotenv').config();

//expose our config variables
const {PORT = 4000, MONGODB_URL} = process.env;

//Database Connection
mongoose.connect(MONGODB_URL);

//set up our mongoDB event listeners
const db = mongoose.connection;
db.on('connected', () => console.log(`Connected to MongoDB on ${db.host}:${db.port}`));
db.on('disconnected', () => console.log(`Disconnected from MongoDB`));
db.on('error', (err) => console.log(`MongoDB Error: ${err.message}`));

//set up people model
const peopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
}, {timestamps:true});

const People = mongoose.model('People', peopleSchema);

//mount middleware
app.use(express.json()); // this creates req.body using incoming JSON from our requests
app.use(morgan('dev'));
app.use(cors());

//Routes
app.get('/', (req,res) => res.redirect('/people'));

app.get('/', (req,res) => {
    res.send('hello world');
});

//index
app.get('/people', async(req,res) =>{
    try {
        res.json(await People.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
})

//new

//create
app.post('/people', async(req,res) =>{
    try {
        res.json(await People.create(req.body));
    } catch (error) {
        res.status(400).json(error)
    }
})

//update
app.put('/people/:id', async(req,res) => {
    try {
        res.json(await People.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {new: true}
            ));
    } catch (error) {
        res.status(400).json(error);
    }
})

//delete
app.delete('/people/:id', async(req,res) =>{
    try {
        res.json(await People.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error);
    }
})


//Listener
app.listen(PORT, ()=> {
    console.log(`server is listening on port ${PORT}`)
})

