const User = require("../models/users-model")

const usernameSchema ={ 
    notEmpty:{
        errorMessage:"username cannot be empty."
    },
    isLength:{ 
        options:{
            min:2
        },
        errorMessage:"username should contain atleast 2 characters"
    }

} 
const loginEmailSchema ={ 
    notEmpty:{
        errorMessage:"email cannot be empty."
    },
    isEmail:{
        errorMessage:"Invalid email."
    }
} 
const registrationEmailSchema = { 
    notEmpty:{
        errorMessage:"email cannot be empty."
    },
    isEmail:{
        errorMessage:"Invalid email."
    },
    custom:{
        options: async (value) => { 
            const user = await User.findOne({email:value})
            if(user){
                throw new Error('This email is already registered with us.')
            }
            else { 
                return true
            }
        }
    }
} 
const phoneSchema ={ 
    notEmpty:{
        errorMessage:"phone cannot be empty."
    },
    isLength:{
        options:{
            min:10,
            max:10
        },
        errorMessage:"Phone number should consist of 10 numbers."
    },
    isNumeric:{
        errorMessage:"Phone can contain only numbers."
    },
    custom:{
        options: async (value) => { 
            const user = await User.findOne({phone:value})
            if(user){
                throw new Error('This phone number is already registered with us.')
            }
            else { 
                return true
            }
        }
    }

}
const passwordSchema={ 
    notEmpty:{
        errorMessage:"password cannot be empty."
    },
    isStrongPassword:{
        errorMessage:"Password should contain minimum 8 characters and atleast 1 lowercase,1 uppercase, 1 digit, 1 symbol."
    }
}
const roleSchema={
    notEmpty:{
        errorMessage:"Role is required."
    },
    isIn:{
        options:[['communityHead','teacher']],
        errorMessage:"Not a valid role."
    }
} 

const userRegistrationSchema = { 
    username:usernameSchema,
    email:registrationEmailSchema,
    phone:phoneSchema,
    password:passwordSchema,
    role:roleSchema,
}
const userLoginSchema = { 
    email:loginEmailSchema,
    password:passwordSchema
}

module.exports = {userLoginSchema,userRegistrationSchema}