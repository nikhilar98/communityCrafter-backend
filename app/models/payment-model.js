const { Schema,model } = require("mongoose");

const paymentSchema = new Schema ({
    userId:{                                                    //cmhead id who purchased
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    requirementId:{
        type:Schema.Types.ObjectId,
        ref:'ClassRequirement',
        required:true,
    },
    amount:{
        required:true,
        type:Number, 
    },                                              
    transactionId:{                                //returned by stripe
        required:true,
        type:String, 
    },                                                                                
    paymentStatus:{
        required:true,
        type:String, 
        enum:['pending','success']
    },                                               //'pending','success' - delete the payment record if it fails checkout
    },{timestamps:true})

const Payment = model('Payment',paymentSchema)

module.exports = Payment