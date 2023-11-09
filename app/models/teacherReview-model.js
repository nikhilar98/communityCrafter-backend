const { Schema,model } = require("mongoose");

const teacherReviewSchema = new Schema ({
        rating:Number,                                     //rating value
        reviewText:String,                                 //review text
        creator:{                                           //cmhead id
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        teacherId:{                                           //teacher for which review is given 
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    })

const TeacherReview = model('TeacherReview',teacherReviewSchema)

module.exports = TeacherReview