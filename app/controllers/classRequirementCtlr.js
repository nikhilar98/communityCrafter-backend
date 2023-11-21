const { validationResult } = require("express-validator")
const ClassRequirement = require("../models/classRequirement-model")
const _ = require('lodash')
const Profile = require("../models/Profile-model")
const {isPointWithinRadius} = require('geolib')

const classRequirementCtlr = {} 

classRequirementCtlr.create = async (req,res) => { 
        
    const errors = validationResult(req) 

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const userId = req.user.id
    const body = _.pick(req.body,['address','title','categoryId','batchSizeRange','payOffered','desiredTimeSlot','weekdays','commencementDate','duration','description'])
    const requirement = new ClassRequirement(body) 
    requirement.status = 'pending'
    requirement.proposals = []
    requirement.creator = userId
    try{
        const requirementSaved= await requirement.save()
        res.json(requirementSaved)
    }
    catch(err){ 
        res.status(500).json({errors:[{msg:err.message}]})
    }
    
}

classRequirementCtlr.getOwnRequirements = async (req,res) => { 
    const userId =req.user.id
    try{
        const requirements = await ClassRequirement.find({creator:userId}).populate('address').populate('creator').populate('proposals').populate('confirmedTeacherId')
        res.json(requirements)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }

}


classRequirementCtlr.getPendingrequirements = async (req,res) => { 
    const userId = req.user.id 

    const transformCoordinates=(coordinates)=>{
        console.log(coordinates)
        return { latitude:coordinates[1] ,longitude:coordinates[0] }
    }

    try{
        const teacherProfile = await Profile.findOne({user:userId}).populate('address')
        if(!teacherProfile){
            return res.status(400).json({errors:[{msg:"Please create your profile first to view the community requirements."}]})
        }
        const teacherCoordinates = teacherProfile.address.location.coordinates
        const requirements = await ClassRequirement.find({status:"pending"}).populate('address').populate('creator')
        const filteredRequirements = requirements.filter(ele=>{
            return isPointWithinRadius(transformCoordinates(ele.address.location.coordinates),transformCoordinates(teacherCoordinates),15000)
                        //isPointWithinRadius({latitude:42.24222,longitude:12.32452},{latitude:20.24222,longitude:11.32452},radius in m )
                        //isPointWithinRadius(point,center point,distance from center point)
        })          
        res.json(filteredRequirements)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
}    //get all requirements that are in pending state and within a set km radius.


classRequirementCtlr.update = async (req,res) => { 
    const userId = req.user.id 
    const classRequirementId = req.params.crId
    try{

        if(req.user.role==='teacher'){
            const requirement = await ClassRequirement.findOneAndUpdate({_id:classRequirementId},{ $push : {proposals:userId}},{new:true}).populate('address').populate('creator')
            //send an sms to the community head notifying him of the proposal. use Twilio
            res.json({requirement,msg:"Your Proposal has been send to the community."})
            
        }
        else if(req.user.role==='communityHead'){
            const body = _.pick(req.body,['userId'])
            const requirement =  await ClassRequirement.findOneAndUpdate({_id:classRequirementId},{confirmedTeacherId:body.userId,status:'fulfilled'},{new:true}).populate('address').populate('creator').populate('confirmedTeacherId')
            //send an SMS to the teacher notifying about the confirmation. use Twilio
            res.json({requirement,msg:"The proposal has been accepted."}) 
        }
    }
    catch(err) { 
        res.status(500).json({errors:[{msg:err.message}]})
    }
}



module.exports = classRequirementCtlr