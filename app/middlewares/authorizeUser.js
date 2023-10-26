const authorizeUser = (roles) => { 
    return (req,res,next) => { 
        if(roles.includes(req.user.role)){
            next()
        }
        else{
            res.status(403).json({errors:[{msg:"You are not authorized to view this section."}]})
        }
    }
}

module.exports = authorizeUser