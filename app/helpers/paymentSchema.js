const paymentSchema = { 
    payOffered : {
        notEmpty:{
            errorMessage:"amount cannot be empty"
        },
        isNumeric:{
            options:{
                min:0
            },
            errorMessage:"amount should be more than 0"
        }
    },
    requirementId:{
        notEmpty:{
            errorMessage:"requirement id is required"
        },
        isMongoId:{
            errorMessage:"invalid requirement id"
        }
    }                             
}

module.exports  = paymentSchema