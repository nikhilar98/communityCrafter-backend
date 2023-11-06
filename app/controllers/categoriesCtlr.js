const { validationResult } = require("express-validator")
const Category = require("../models/category-model")
const _ = require('lodash')

const categoriesCtlr = {}  

categoriesCtlr.getCategories = async (req,res) => { 
    try{
        const categories = await Category.find() 
        res.json(categories)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
}

categoriesCtlr.create = async (req,res) => { 

    const errors = validationResult(req) 

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    try{
        const body = _.pick(req.body,['name'])
        const category = new Category(body)
        const savedCategory = await category.save() 
        res.json(savedCategory)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
}

module.exports = categoriesCtlr