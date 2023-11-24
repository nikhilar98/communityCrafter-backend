require('dotenv').config()
const stripe = require('stripe')(`${process.env.STRIPE_API_KEY}`);

const paymentCltr = {} 


paymentCltr.checkout = async (req,res) => { 

    const amount = req.body.payOffered

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
            success_url: `http://localhost:5173/create-checkout-session/requirement?success=true`,
            cancel_url: `http://localhost:5173/create-checkout-session/requirement?canceled=true`,
          });
          res.json(session);
    }
    catch(err){
        res.status(400).json({errors:[{msg:err.message}]})
    }

}


module.exports = paymentCltr
