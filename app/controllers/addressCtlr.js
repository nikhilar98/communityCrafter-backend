const { validationResult } = require("express-validator")
const _ = require('lodash')
const axios = require('axios')
const Address = require("../models/address-model")

const addressCtlr = {} 
 
addressCtlr.createAddress = async (req,res) =>{ 

    const errors = validationResult(req) 

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const userId = req.user.id 
    const body = _.pick(req.body,['building','locality','city','state','pincode','country'])
    const searchString = `${body.building}%2C%20${body.locality}%2C%20${body.city}%2C%20${body.state}%2C%20${body.pincode}%2C%20${body.country}`
    try{
        const  mapResponse =  await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=9c21058189c042d5873df89c4c08a2f1`)
        const location = [mapResponse.data.features[0].properties.lon,mapResponse.data.features[0].properties.lat]
        body.location = {type:'Point',coordinates:location}
        body.user = userId
        const address = new Address(body) 
        const savedAddress = await address.save() 
        res.json(savedAddress)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})
    }
    
}

addressCtlr.getAddressList = async (req,res) => { 
    try{
        const allAddresses = await Address.find() 
        res.json(allAddresses)
    }
    catch(err){
        res.status(500).json({errors:[{msg:err.message}]})  
    }
}

module.exports = addressCtlr




