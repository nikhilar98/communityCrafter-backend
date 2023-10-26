const express = require('express') 
const cors = require('cors')
const configDb = require('./config/db')
const usersCtlr = require('./app/controllers/usersCtlr')
require('dotenv').config() 
const {checkSchema} = require('express-validator')
const {userLoginSchema,userRegistrationSchema,userEditSchema,adminEditUserSchema} = require('./app/helpers/usersSchema')
const authenticateUser = require('./app/middlewares/authenticateUser')
const authorizeUser = require('./app/middlewares/authorizeUser')

const app =express() 

const port= process.env.PORT

app.use(express.json())
app.use(cors())

configDb()

//users

app.post('/comcraft/register',checkSchema(userRegistrationSchema),usersCtlr.register)

app.post('/comcraft/login',checkSchema(userLoginSchema),usersCtlr.login)

app.get('/comcraft/verifyEmail/:userId',usersCtlr.verifyEmail)

app.get('/comcraft/getProfile',authenticateUser,usersCtlr.getProfile)

app.put('/comcraft/editProfile',authenticateUser,checkSchema(userEditSchema),usersCtlr.editProfile)

app.get('/comcraft/getAllProfiles',authenticateUser,authorizeUser(['admin']),usersCtlr.getAllProfiles)  //admin can see all the user details

app.put('/comcraft/editUserPriviliges/:userId',authenticateUser,authorizeUser(['admin']),checkSchema(adminEditUserSchema),usersCtlr.editUserPriviliges)  //admin can edit the the role or isVerified

app.delete('/comcraft/deleteProfile/:userId',authenticateUser,authorizeUser(['admin']),usersCtlr.deleteProfile)  //admin can delete any user

 
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})