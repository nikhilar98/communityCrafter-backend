const jwt = require('jsonwebtoken')
require('dotenv').config()
const authenticateUser = (req,res,next) => { 
    const token = req.headers.authorization.split(' ')[1]
    if(!token){
        res.status(400).json({errors:[{msg:"Invalid user."}]})
    }
    try{
        const tokenData =  jwt.verify(token,process.env.SECRET_KEY)
        req.user = tokenData
        next()
    }
    catch(err){
        res.status(400).json({errors:[{msg:"Invalid user."}]})
    }
}

module.exports = authenticateUser