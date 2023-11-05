const {Schema,model} = require('mongoose')
 
const profileSchema = new Schema ({
    bio : String,                               //for teachers / cmhead (bio) 
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
            experience:Number,
            certificates: [ 
                {                                 //for teachers
                    url:String,
                    key:String
                }
            ],
        }
    ],                               
    userId:{                                            //for everyone
        type:Schema.Types.ObjectId,
        ref:'User'
    }
    // classRequirements:[                                 //for teachers / cmhead - will have different meanings : for teacher Profile (classes being provided by teacher) ,for cmhead profile (class reqs created by cmhead head)
    //     {
    //         type:Schema.Types.ObjectId,
    //         ref:'ClassRequirement'
    //     }
    // ]
})

const Profile = model('Profile',profileSchema)

module.exports = Profile 
