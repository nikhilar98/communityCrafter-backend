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
const attachCertificateImages = require('./app/middlewares/attachCertificateImages')
const {teacherProfileSchema,cmHeadProfileSchema} = require('./app/helpers/profileSchema')
const addressSchema = require('./app/helpers/addressSchema')
const addressCtlr = require('./app/controllers/addressCtlr')
const categoriesCtlr = require('./app/controllers/categoriesCtlr')
const categorySchema = require('./app/helpers/categorySchema')
const classRequirementSchema = require('./app/helpers/classRequirementSchema')
const classRequirementCtlr = require('./app/controllers/classRequirementCtlr')
const teacherReviewCtlr = require('./app/controllers/teacherReviewCtlr')
const teacherReviewSchema = require('./app/helpers/teacherReviewSchema')


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

app.get('/comcraft/getProfile',authenticateUser,authorizeUser(['teacher','communityHead']),profileCtlr.getProfile)

app.get('/comcraft/user/:userId',profileCtlr.showProfile) //public

app.post('/comcraft/teacher/createProfile',upload.any(),authenticateUser,authorizeUser(['teacher']),attachCertificateImages,checkSchema(teacherProfileSchema),profileCtlr.create) //profile creation for teacher

app.post('/comcraft/communityHead/createProfile',authenticateUser,authorizeUser(['communityHead']),checkSchema(cmHeadProfileSchema),profileCtlr.create) //profile creation for cm head


//address

app.get('/comcraft/address',authenticateUser,authorizeUser(['teacher','communityHead']),addressCtlr.getAddress)

app.post('/comcraft/address',authenticateUser,checkSchema(addressSchema),addressCtlr.createAddress)


//categories 

app.get('/comcraft/categories',categoriesCtlr.getCategories) 

app.post('/comcraft/categories',authenticateUser,authorizeUser(['admin']),checkSchema(categorySchema),categoriesCtlr.create)

//classRequirementSchema  

app.post('/comcraft/classRequirement',authenticateUser,authorizeUser(['communityHead']),checkSchema(classRequirementSchema),classRequirementCtlr.create)

app.get('/comcraft/classRequirements',authenticateUser,authorizeUser(['communityHead']),classRequirementCtlr.getOwnRequirements)  //for community heads to see their own created reqs

app.get('/comcraft/classRequirements/pending',authenticateUser,authorizeUser(['teacher']),classRequirementCtlr.getPendingrequirements) //implement the address based requirement listing feature for teachers - show requirements within 5km radius

app.put('/comcraft/classRequirement/:crId',authenticateUser,authorizeUser(['teacher','communityHead']),classRequirementCtlr.update)

//teacher review routes
app.post('/comcraft/teacherReview/:teacherId',authenticateUser,authorizeUser(['communityHead']),checkSchema(teacherReviewSchema),teacherReviewCtlr.create)

app.get('/comcraft/teacherReview/:teacherId',authenticateUser,authorizeUser(['teacher','communityHead']),teacherReviewCtlr.getReviews) //get reviews on the teacher

app.put('/comcraft/teacherReview/:reviewId',authenticateUser,authorizeUser(['communityHead']),checkSchema(teacherReviewSchema),teacherReviewCtlr.updateReview)

app.delete('/comcraft/teacherReview/:reviewId',authenticateUser,authorizeUser(['communityHead']),teacherReviewCtlr.deleteReview)





app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})