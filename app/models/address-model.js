const { Schema,model } = require("mongoose");

const addressSchema = new Schema ({  //for teachers/ cmheads : for teachers it can be used to filter out the class requirements by communities within a radius of 5 km from his address upon login

        building:String,
        locality:String,
        city:String,
        state:String,
        location:{
            type:"Point",
            coordinates: [-73.856077, 40.848447]
        },   //geospatial data
        profile:{             
            type:Schema.Types.ObjectId,
            ref:'Profile'
        }    
})

const Address = model('Address',addressSchema)

module.exports = Address