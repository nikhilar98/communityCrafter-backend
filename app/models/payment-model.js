const { Schema,model } = require("mongoose");

const paymentSchema = new Schema ({
    userId:{                                                    //cmhead id who purchased
        type:Schema.Types.OjectId,
        ref:'User'
    },
    amount:Number,  
    method:String,                                               
    transactionId:String,                                       //returned by Stripe                                               //UPI/card/cash
    paymentStatus:String                                               //'success','failed' etc.. returned by Stripe
    },{timestamps:true})

const Payment = model('Payment',paymentSchema)

module.exports = Payment