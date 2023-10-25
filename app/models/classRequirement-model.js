const { Schema,model } = require("mongoose");

const classRequirementSchema = new Schema ({   
        creator:{                                         //cmhead id
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        address:{                                        //cm head /community address
            type:Schema.Types.ObjectId,
            ref:'Address'
        },
        categoryId: {                                       //category of class eg : "music","dance","math"
            type:Schema.Types.ObjectId,
            ref:'Category'
        },
        batchSizeRange: {                                   //number of students in a batch
            type:String,
            enum:['1','2-4','5-8','8-12']
        },
        payOffered: Number,                                  //"12000"
        desiredTimeSlot: String,                            //"17:00-18:00"
        weekdays: [String],                                 //['Mon','Tue','Fri']
        commencementDate : Date,                            //'2023-02-12'
        duration:String,                                    //'2 months'
        status:{                                            // pending for unattended requirements or when a teacher is dropped from a requirement by cmhead, fulfilled for requirements that are accepted
            type:String,
            enum:['pending','fulfilled']
        },
        proposals:[                                         // teachers that have accepted the class requirement
            {
                type:Schema.Type.ObjectId,
                ref:'User'
            }
        ],
        confirmedTeacherId :  {                             //teacher selected for requirement by the cmhead
            type:Schema.Type.ObjectId,
            ref:'User'
        }
})

const ClassRequirement = model('ClassRequirement',classRequirementSchema)

module.exports = ClassRequirement