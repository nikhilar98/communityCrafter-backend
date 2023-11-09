const teacherReviewSchema = { 
    rating:{
        notEmpty:{
            errorMessage:"Rating cannot be empty."
        },
        isInt:{
            options:{
                min:0,
                max:5
            },
            errorMessage:"Rating should be between 0-5"
        }
    },
    reviewText:{
        notEmpty:{
            errorMessage:"Review cannot be empty."
        },
        isLength:{
            options:{
                min:3
            },
            errorMessage:"Review should have atleast 3 characters."
        }
    }
}

module.exports = teacherReviewSchema