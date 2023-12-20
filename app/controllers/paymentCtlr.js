const { validationResult } = require('express-validator');
const Payment = require('../models/payment-model');

require('dotenv').config()
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);

const paymentCltr = {} 


paymentCltr.checkout = async (req,res) => { 


  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }

    const amount = req.body.payOffered
    const requirementId = req.body.requirementId
    const userId = req.user.id

    try{
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                      currency: "inr",
                      product_data: {
                        name: "payment for community requirement",
                      },
                      unit_amount: amount * 100,
                    },
                    quantity: 1
                  }
            ],
            mode: 'payment',
            success_url: `https://community-crafter-frontend.vercel.app/create-checkout-session/requirement?success=true`, //http://localhost:5173/create-checkout-session/requirement?success=true
            cancel_url: `https://community-crafter-frontend.vercel.app/create-checkout-session/requirement?canceled=true`,//http://localhost:5173/create-checkout-session/requirement?canceled=true
          });
          
          const payment = new Payment()
          payment.amount=amount
          payment.requirementId = requirementId
          payment.paymentStatus='pending'
          payment.userId=userId
          payment.transactionId=session.id

          const savedPayment = await payment.save()
          res.json(session);
    }
    catch(err){
        res.status(400).json({errors:[{msg:err.message}]})
    }

}

paymentCltr.update = async(req,res) => { 

    const transactionId = req.params.transactionId
    try{
      const updatedPayment = await Payment.findOneAndUpdate({transactionId:transactionId},{paymentStatus:'success'})
      res.json(updatedPayment)
    }
    catch(err){
        res.status(400).json({errors:[{msg:err.message}]})
    }

}

paymentCltr.delete = async (req,res) => { 

    const transactionId = req.params.transactionId

    try{
      const deletedPayment = await Payment.findOneAndDelete({transactionId:transactionId})
      res.json(deletedPayment)
    }
    catch(err){
        res.status(400).json({errors:[{msg:err.message}]})
    }

}


module.exports = paymentCltr
