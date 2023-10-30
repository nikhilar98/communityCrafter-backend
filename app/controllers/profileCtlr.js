const _ = require('lodash')
const Profile = require('../models/Profile-model')

const profileCtlr = {} 

profileCtlr.create = async (req,res) => { 

    const userId = req.user.id
    
    if(req.user.role == 'teacher') { 

        const body = _.pick(req.body,['desciption','address','teachingCategories'])
        const profile = new Profile(body) 
        profile.userId= userId
        try{
            const savedProfile = await profile.save() 
            res.json(savedProfile)
        }
        catch(err){
            res.status(500).json({errors:[{msg:err.message}]})
        }

    }

    else if(req.user.role=='communityHead') { 

        const body = _.pick(req.body,['desciption','address'])


    }
}

module.exports = profileCtlr