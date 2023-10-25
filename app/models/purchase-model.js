const { Schema,model } = require("mongoose");

const purchaseSchema = new Schema ({
    userId:{                                                    //communityHead id 
        type:Schema.Types.OjectId,
        ref:'User'
    },
    paymentId:{                                                 //payment id (not to confuse with transaction id)
        type:Schema.Types.OjectId,
        ref:'Payment'
    },
    classRequirementId:{                                            
        type:Schema.Types.OjectId,
        ref:'classRequirement'
    }
})

const Purchase = model('Purchase',purchaseSchema)

module.exports = Purchase