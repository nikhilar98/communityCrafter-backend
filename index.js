const express = require('express') 
const cors = require('cors')
const configDb = require('./config/db')
const usersCtlr = require('./app/controllers/usersCtlr')
require('dotenv').config() 
const {checkSchema} = require('express-validator')
const { userLoginSchema,userRegistrationSchema } = require('./app/helpers/usersSchema')

const app =express() 

const port= process.env.PORT

app.use(express.json())
app.use(cors())

configDb()

app.post('/comcraft/register',checkSchema(userRegistrationSchema),usersCtlr.register)

app.post('/comcraft/login',checkSchema(userLoginSchema),usersCtlr.login)

app.get('/comcraft/verifyEmail/:userId',usersCtlr.verifyEmail)
 
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})