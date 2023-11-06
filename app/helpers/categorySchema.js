const categorySchema ={
    name:{
        notEmpty:{
            errorMessage:"Category name cannot be empty."
        },
        isLength:{
            options:{
                min:2
            },
            errorMessage:"Category name should consist of atleast 2 characters."
        }
    }
} 

module.exports = categorySchema

