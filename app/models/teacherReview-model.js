const { Schema,model } = require("mongoose");

const teacherReviewSchema = new Schema ({
        rating:Number,                                     //rating value
        reviewBody:String,                                 //review text
        communityHead:{                                           //cmhead id
            type:Schema.Types.OjectId,
            ref:'User'
        },
        teacherid:{                                           //teacher for which review is given 
            type:Schema.Types.OjectId,
            ref:'User'
        }
    })

const TeacherReview = model('TeacherReview',teacherReviewSchema)

module.exports = TeacherReview