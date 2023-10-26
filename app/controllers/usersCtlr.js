const usersCtlr = {} 
const {validationResult} = require('express-validator')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()
const User = require('../models/users-model')

const transporter =nodemailer.createTransport({  //Initialise nodemailer  
    service: 'gmail',
    auth: {
        user: process.env.G_EMAIL,
        pass: process.env.G_PASS
    }
});

transporter.verify((err,success)=>{  //check for initialisation status
    if(err){
        console.log("Nodemailer initialisation error : ",err)
    }
    else{
        console.log("Nodemailer : ",success,'ready for messages')
    }
})


usersCtlr.register = async (req,res) => { 
    
    const errors = validationResult(req) 

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    
    const body = _.pick(req.body,['username','email','password','phone','role'])
    const user = new User(body) 
    try{
        const salt = await bcrypt.genSalt() 
        const hashedPwd = await bcrypt.hash(user.password,salt)
        user.password = hashedPwd 
        user.isVerified = false
        const existingUsers = await User.countDocuments()
        if(existingUsers==0){
            user.role='admin'         //first user is given admin role automatically
        }
        const savedUser = await user.save()
        const encryptedUserId = jwt.sign({userId:savedUser._id},process.env.SECRET_KEY,{expiresIn:'1h'})
        transporter.sendMail({
            from:  process.env.G_EMAIL, // sender address
            to: `${user.email}`, // list of receivers
            subject: "Successfully registered.", // Subject line
            text: `Hello ${user.username}! Welcome to Community Crafter.`, // plain text body
            html:`<a href='http://localhost:3636/comcraft/verifyEmail/${encryptedUserId}'>Click here to verify your email.</a>`
        });

        res.json({msg:"Congratulations! Check you email to verify before signing in."})
    }
    catch(err){ 
        res.status(500).json({errors:[{msg:err.message}]})
    }
}

usersCtlr.login = async(req,res) => { 

    const errors = validationResult(req) 

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const body = _.pick(req.body,['email','password'])
    try{
        const user = await User.findOne({email:body.email})
        if(!user){
            return res.status(400).json({errors:[{msg:"Invalid email / password ."}]})
        }
        if(!user.isVerified){
            return res.status(404).json({errors:[{msg:"Email is not verified. Check your mail to verify."}]})
        }
        const allowLogin = await bcrypt.compare(body.password,user.password)
        if(!allowLogin){
            return res.status(400).json({errors:[{msg:"Invalid email / password ."}]})
        }
        const token = jwt.sign({id:user._id,role:user.role},process.env.SECRET_KEY)
        res.json({token:`bearer ${token}`})
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
}

usersCtlr.verifyEmail = async (req,res) => { 

    const encryptedUserId = req.params.userId 
    let userId
    try{
        const payload = jwt.verify(encryptedUserId,process.env.SECRET_KEY)
        userId = payload.userId
    }
    catch(err){
        return res.status(400).send("Sorry, we think you are lost.")
    }

    try{
        await User.findByIdAndUpdate(userId,{isVerified:true})
        res.send("You are verified.")//res.redirect(`http://localhost:${frontendPortNumber}/comcraft/login`)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
    
}

usersCtlr.getProfile = async (req,res) => { 
    const userId = req.user.id
    try{
            const user = await User.findById(userId)
            res.json(_.pick(user,['username','email','phone','role']))
        }
    catch(err){ 
            res.status(500).json({errors:[{msg:err.message}]})
        }
}

usersCtlr.editProfile = async (req,res) => { 

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const userId = req.user.id //users can edit their own profile details : email,pwd,phone,username
        const body = _.pick(req.body,['username','email','phone'])
        try{
            const user = await User.findByIdAndUpdate(userId,
            {
                username:body.username,
                email:body.email,
                phone:body.phone
            },{new:true,runValidators:true})

            res.json(user)
        }
        catch(err) { 
            res.status(500).json({errors:[{msg:err.message}]})  
        }
}

usersCtlr.getAllProfiles = async (req,res) => { 
    try{
        const users = await User.find() 
        res.json(users) //only isverified and role fields will be enabled for editing.
    }
    catch(err) { 
        res.status(500).json({errors:[{msg:err.message}]})  
    }
}

usersCtlr.editUserPriviliges = async (req,res) => { 

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
    //admin can edit anyone's role or isVerified
        const userId = req.params.userId
        const body = _.pick(req.body,['role','isVerified'])
    
        try{
            const user = await User.findByIdAndUpdate(userId,{role:body.role,isVerified:body.isVerified},{new:true,runValidators:true})
            res.json(user)
        }
        catch(err){
            res.status(500).json({errors:[{msg:err.message}]})  
        }

    
}

usersCtlr.deleteProfile = async (req,res) => {
    const userId = req.params.userId
    
    try{
        const user = await User.findByIdAndDelete(userId)
        res.json({msg:"User deleted Successfully."})
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})  
    }
}

module.exports = usersCtlr