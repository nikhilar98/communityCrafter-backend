const {Schema,model} = require('mongoose')
 
const profileSchema = new Schema ({
    certifications: [                                   //for teachers
        {
            title:String,
            photo:img
        }
    ],
    description : String,                               //for teachers / cmhead
    address: {                                          //for teachers / cmhead
        type:Schema.Types.ObjectId,
        ref:'Address'
    } ,                                
    teachingCategories: [                                //for teachers
        {
            categoryId:{
                type:Schema.Types.ObjectId,   
                ref:'Category'
            },
            years:Number
        }
    ],
    reviews:[                                            //for teachers
        {
            type:Schema.Types.ObjectId,
            ref:'TeacherReview'
        }
    ],
    userId:{                                            //for everyone
        type:Schema.Types.OjectId,
        ref:'User'
    },
    classRequirements:[                                 //for teachers / cmhead - will have different meanings : for teacher Profile (classes attended by teacher) ,for cmhead profile (class reqs created by cmhead head)
        {
            type:Schema.Types.ObjectId,
            ref:'ClassRequirement'
        }
    ]
})

const Profile = model('Profile',profileSchema)

module.exports = Profile 
