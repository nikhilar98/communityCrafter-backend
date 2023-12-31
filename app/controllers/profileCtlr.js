const _ = require('lodash')
const Profile = require('../models/Profile-model')
const {validationResult} = require('express-validator')
const uploadToS3 = require('../../config/aws')
const Address = require('../models/address-model')


const profileCtlr = {} 

profileCtlr.getProfile = async (req,res) => { 
    const userId = req.user.id
    try{
        const userProfile = await Profile.findOne({user:userId}).populate('address')
        res.json(userProfile)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
}
profileCtlr.showProfile = async (req,res) => {  //for cm heads
    const userId = req.params.userId
    try{
        const userProfile = await Profile.findOne({user:userId}).populate('address').populate('user',['username','email','phone'])
       
        res.json(userProfile)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
}

profileCtlr.getTutors = async(req,res) => { 
    try{
        const tutors = await Profile.find({role:'teacher'}).populate('user',['username','email','phone'])
        res.json(tutors)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
}

profileCtlr.create = async (req,res) => {
    
    const errors = validationResult(req) 

    if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
    }

    const userId = req.user.id
    if(req.user.role == 'teacher') { 
        const filesData = req.files 
        //<input type="file" name="uploaded_file"> the name property for the file input types will be `${ele._id}` where ele is each category object
        const body = _.pick(req.body,['bio','address','teachingCategories'])
        body.user= userId
        body.role=req.user.role
        try{
            for (const file of filesData) {
                const uploadResult = await uploadToS3(file, userId);
                const obj = body.teachingCategories.find(ele=>ele.categoryId==file.fieldname)
                obj.certificates.push(uploadResult)
            }
            
            const profile = new Profile(body) 
            const savedProfile = await profile.save() 
            const addressObj = await Address.findById(savedProfile.address)
            savedProfile.address=addressObj
            res.json(savedProfile)
        }
        catch(err){
            res.status(500).json({errors:[{msg:err.message}]})
        }

    }

    else if(req.user.role=='communityHead') { 

        const body = _.pick(req.body,['address'])
        const profile = new Profile() 
        profile.address = body.address
        profile.user= userId
        profile.role = req.user.role
        try{
            const savedProfile = await profile.save()
            const addressObj = await Address.findById(savedProfile.address)
            savedProfile.address=addressObj 
            res.json(savedProfile)
        }
        catch(err){
            res.status(500).json({errors:[{msg:err.message}]})
        }

    }
}



module.exports = profileCtlr