const _ = require('lodash')
const TeacherReview = require('../models/teacherReview-model')
const { validationResult } = require('express-validator')

const teacherReviewCtlr = {}

teacherReviewCtlr.create = async (req,res) => { 

    const errors = validationResult(req) 

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const teacherId = req.params.teacherId 
    const creatorId = req.user.id 

    const body = _.pick(req.body,['rating','reviewText'])

    const review = new TeacherReview(body)
    review.creator = creatorId 
    review.teacherId = teacherId 
    try{
        const savedReview = await review.save() 
        const newReview = await TeacherReview.findOne({_id:savedReview._id}).populate('creator')
        res.json(newReview)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})  
    }
}

teacherReviewCtlr.getReviews = async (req,res) => { 
    const teacherId = req.params.teacherId 
    try{
        const teacherReviews = await TeacherReview.find({teacherId:teacherId}).populate('creator')
        res.json(teacherReviews)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})  
    }
}

teacherReviewCtlr.updateReview = async (req,res) => { 

    
    const errors = validationResult(req) 

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const creatorId = req.user.id 
    const reviewId = req.params.reviewId
    const body = _.pick(req.body,['rating','reviewText'])

    try{
        const updatedReview = await TeacherReview.findOneAndUpdate({creator:creatorId,_id:reviewId},body,{new:true,runValidators:true})
        if(updatedReview){
            res.json(updatedReview)
        }
        else{
            res.json({msg:"Review not found."})
        }
       
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})  
    }

}

teacherReviewCtlr.deleteReview = async (req,res) => { 
    const creatorId = req.user.id 
    const reviewId = req.params.reviewId
    try{
        const deletedReview = await TeacherReview.findOneAndDelete({creator:creatorId,_id:reviewId})
        if(deletedReview){
            res.json(deletedReview)
        }
        else{
            res.json({msg:"Review not found."})
        }
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})  
    }
}

module.exports = teacherReviewCtlr