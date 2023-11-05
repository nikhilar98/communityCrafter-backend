const express = require('express') 
const cors = require('cors')
const multer = require('multer')
const configDb = require('./config/db')
const usersCtlr = require('./app/controllers/usersCtlr')
const profileCtlr = require('./app/controllers/profileCtlr')
require('dotenv').config() 
const {checkSchema} = require('express-validator')
const {userLoginSchema,userRegistrationSchema,userEditSchema,adminEditUserSchema} = require('./app/helpers/usersSchema')
const authenticateUser = require('./app/middlewares/authenticateUser')
const authorizeUser = require('./app/middlewares/authorizeUser')
const profileSchema = require('./app/helpers/profileSchema')
const attachCertificateImages = require('./app/middlewares/attachCertificateImages')


const app =express() 

const upload = multer()  

const port= process.env.PORT

app.use(express.json())
app.use(cors())


configDb()

//users

app.post('/comcraft/register',checkSchema(userRegistrationSchema),usersCtlr.register)

app.post('/comcraft/login',checkSchema(userLoginSchema),usersCtlr.login)

app.get('/comcraft/verifyEmail/:userId',usersCtlr.verifyEmail)

app.get('/comcraft/getAccount',authenticateUser,usersCtlr.getAccount)

app.put('/comcraft/editAccount',authenticateUser,checkSchema(userEditSchema),usersCtlr.editAccount)

app.get('/comcraft/getAllAccounts',authenticateUser,authorizeUser(['admin']),usersCtlr.getAllAccounts)  //admin can see all the user details

app.put('/comcraft/editUserPriviliges/:userId',authenticateUser,authorizeUser(['admin']),checkSchema(adminEditUserSchema),usersCtlr.editUserPriviliges)  //admin can edit the the role or isVerified

app.delete('/comcraft/deleteAccount/:userId',authenticateUser,authorizeUser(['admin']),usersCtlr.deleteAccount)  //admin can delete any user

//profile 

app.post('/comcraft/createProfile',upload.any(),authenticateUser,authorizeUser(['teacher','communityHead']),attachCertificateImages,profileCtlr.create) 


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})