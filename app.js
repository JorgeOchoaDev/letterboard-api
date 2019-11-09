const http = require('http')

const express =require('express')

const app = express()

app.get('/',(req,res)=>{
    res.send('<h1>get function working</h1>')
})

app.listen(3000)