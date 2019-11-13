const http = require('http')
const cors = require('cors')
const express =require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require("dotenv").config({ path: "./.env" })



app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cors())


mongoose.connect('mongodb+srv://jorge:Md2^qqPhw4!39CXDJ0F&@letterboard-tlnpa.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Unable to connect to database. Aborting...', err);
        process.exit();
    });

const Credential = mongoose.model('Credential',{
    username: String,
    hash: String
})

const Movie = mongoose.model('Movie',{
    id: String,
    title:String,
    director:String,
    release: String,
    exit: String,
    source: String
})

app.post('/login',async (req,res)=>{
    const loginCredential = await Credential.findOne({username:req.body.username})
    const isValid = await bcrypt.compare(req.body.password, loginCredential.hash)
    res.send(isValid)
})

app.post('/usergen',async (req,res)=>{
    let hash = await bcrypt.hash(req.body.password, 10 );
    const userGen = new Credential ({
        username : req.body.username,
        hash : hash
    })
    userGen.save()
    .then(()=>res.send('credential saved'))
})

app.get('/getmovies',(req,res)=>{
    Movie.find()
    .then(movies => {
        res.send(movies);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data."
        });
    });
})

app.post('/',(req,res)=>{
    console.log(req.body,)
    const release = new Movie ({
        id: req.body.id,
        title: req.body.title,
        director: req.body.director,
        release: req.body.release,
        exit: req.body.exit,
        source: req.body.source
    })
    release.save()
    .then(()=>res.send('movie saved'))

})

app.listen(process.env.PORT, ()=>{console.log('listening on port '+ process.env.PORT)})