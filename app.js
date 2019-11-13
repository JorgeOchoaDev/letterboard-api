const http = require('http')
const cors = require('cors')
const express =require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var moment = require('moment');
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
    source: String,
    epoch: Number
})

app.post('/login',async (req,res)=>{
    console.log("login running")
    const loginCredential = await Credential.findOne({username:req.body.username})
    const isValid = await bcrypt.compare(req.body.password, loginCredential.hash)
    res.send({login: isValid})
})

app.post('/usergen',async (req,res)=>{
    let hash = await bcrypt.hash(req.body.password, 10 );
    const userGen = new Credential ({
        username : req.body.username,
        hash : hash
    })
    userGen.save()
    .then(()=>res.send({message: "credential saved"}))
})

app.get('/getmovies',(req,res)=>{
    Movie.find()
    .then(movies => {
        res.send(movies)
    }).catch(err => {
        res.status(500).send("Connection error!")
    })
})

app.post('/',async (req,res)=>{
    console.log(req.body)
//    const movieCollection = await Movie.find().sort({epoch:-1})
//    const lastEpoch = movieCollection[0].epoch
    let epoch = moment().unix()
//    if (epoch - lastEpoch > 300){
        const release = new Movie ({
            id: req.body.id,
            title: req.body.title,
            director: req.body.director,
            release: req.body.release,
            exit: req.body.exit,
            source: req.body.source,
            epoch: epoch
       })
        release.save()
        .then(()=>res.send({message: "Movie saved!"}))
//    }
//    else {
//        res.status(500).send('You must wait 5 minutes in between submissions!')
//    }

})

app.listen(process.env.PORT, ()=>{console.log('listening on port '+ process.env.PORT)})