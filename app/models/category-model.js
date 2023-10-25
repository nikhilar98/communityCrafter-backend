const { Schema,model } = require("mongoose");

const categorySchema = new Schema ({
    name:String
        //user cannot create a category. Hardcoded categories eg: ['dance','music,'drawing' etc..]
    })

const Category = model('Category',categorySchema)

module.exports = Category