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
profileCtlr.showProfile = async (req,res) => { 
    const userId = req.params.userId
    console.log(userId)
    try{
        const userProfile = await Profile.findOne({user:userId}).populate('address').populate('user',['username','email','phone'])
       
        res.json(userProfile)
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
        try{
            for (const file of filesData) {
                const uploadResult = await uploadToS3(file, userId);
                console.log('checkpoint 2')
                const obj = body.teachingCategories.find(ele=>ele.categoryId==file.fieldname)
                obj.certificates.push(uploadResult)
            }
            console.log('checkpoint 3')
            const profile = new Profile(body) 
            console.log('checkpoint 4')
            const savedProfile = await profile.save() 
            console.log('checkpoint 5')
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