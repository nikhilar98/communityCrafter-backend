const { Schema,model } = require("mongoose");

const paymentSchema = new Schema ({
    userId:{                                                    //cmhead id who purchased
        type:Schema.Types.OjectId,
        ref:'User'
    },
    amount:Number,                                                 
    transactionId:String,                                       //returned by Stripe 
    method:String,                                              //UPI/card/cash
    status:String                                               //'success','failed' etc.. returned by Stripe
    },{timestamps:true})

const Payment = model('Payment',paymentSchema)

module.exports = Payment