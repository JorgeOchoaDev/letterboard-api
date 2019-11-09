const http = require('http')
const cors = require('cors')
const express =require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(cors())


mongoose.connect('mongodb+srv://jorge:Md2^qqPhw4!39CXDJ0F&@letterboard-tlnpa.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });


const Movie = mongoose.model('Movie',{name:String})




app.get('/',(req,res)=>{
    res.send('get function working')
})

app.post('/',(req,res)=>{
    console.log(req.body.name,)
    const release = new Movie ({
        name: req.body.name
    })
    release.save()
    .then(()=>res.send('movie saved'))

})


app.listen(process.env.PORT, ()=>{console.log('listening on port 3000')})