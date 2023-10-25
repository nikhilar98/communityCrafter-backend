const { Schema,model } = require("mongoose");

const addressSchema = new Schema ({  //for teachers/ cmheads : for teachers it can be used to filter out the class requirements by communities within a radius of 5 km from his address upon login
        name:String,
        address:String,
        city:String,
        state:String,
        coordinates:[Number]    //eg: [12.599896, 78.595631]
})

const Address = model('Address',addressSchema)

module.exports = Address