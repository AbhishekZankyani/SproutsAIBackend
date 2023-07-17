const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const cors = require('cors')

const mongoose= require('mongoose')
const task = require('./Jobs/ChangeStatusJob')
const url = process.env.DBURL
app.use(cors())
mongoose.connect(url,{})
const con = mongoose.connection
con.on('open',()=>{
})

app.use(express.json())
app.use('/',require('./routes/User'))
app.use('/Roles',require('./routes/Roles'))
app.use('/Tasks',require('./routes/Tasks'))



task.start()

const port = process.env.PORT||1234
app.listen(port,()=>{
    console.log(`server Connected go to server by line http://localhost:${port}`)
})