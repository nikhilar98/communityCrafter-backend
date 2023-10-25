const {Schema,model} = require('mongoose')
 
const userSchema = new Schema ({ 
    username:String,
    email:String,
    phone:String,
    password:String,
    role:{
        type:String,
        enum:['admin','communityHead','teacher']
    },
    isVerified:Boolean
},{timestamps:true})

const User = model('User',userSchema)

module.exports = User 
