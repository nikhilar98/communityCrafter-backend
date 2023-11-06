const { Schema,model } = require("mongoose");

const addressSchema = new Schema ({  //for teachers/ cmheads : for teachers it can be used to filter out the class requirements by communities within a radius of 5 km from his address upon login

        building:{
           type:String,
           required:true
        },
        locality:{
            type:String,
            required:true
         },
        city:{
            type:String,
            required:true
         },
        state:{
            type:String,
            required:true
         },
        pincode:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        location:{
            type:{
                type:String,
                required:true,
                enum:['Point']
            },
            coordinates: {      
                required:true,
                type:[Number]       //geospatial data
            }
        },   
        user:{             
            type:Schema.Types.ObjectId,
            ref:'User'
        }    
})

const Address = model('Address',addressSchema)

module.exports = Address