const http = require('http')

const cors = require('cors')

const express =require('express')

const app = express()

app.use(cors())

app.get('/',(req,res)=>{
    res.send('get function working')
})


app.listen(3000, ()=>{console.log('listening on port 3000')})