const addressSchema = {
    notEmpty:{
        errorMessage:"Address is required"
    },
    isMongoId:{ 
        errorMessage:"Invalid address."
    }
}

const teacherProfileSchema = {  
    bio:{
        notEmpty:{
            errorMessage:"Bio cannot be emtpy."
        },
        isLength:{
            options:{min:5},
            errorMessage:"Atleast 5 characters required."
        }
    },
    address:addressSchema,
    teachingCategories:{
        isArray:{
            options:{
                min:1
            },
            errorMessage:"Atleast 1 category required"
        },
        custom: {   //category cannot be empty string
            options: async (value) => { 
                const validateCategory = value.every(ele=>{
                    return ele.categoryId!=""
                })
                if(validateCategory){
                    return true
                }
                else { 
                    throw new Error('Category required.')
                }
            }
        },
        custom: { //experience should be greater than 0
            options: async (value) => { 
                const validateExp = value.every(ele=>{
                    return ele.experience!="" && Number(ele.experience)>=0
                })
                if(validateExp){
                    return true
                }
                else { 
                    throw new Error('Invalid experience.')
                }
            }
        },
         
        custom: {  //checking for atleast 1 certificate per category
            options:async (value,{req}) => { 

                for(let i of req.certificateFields){
                    const fileFoundForCategory = req.files.find(ele=>ele.fieldname==i.name)
                    if(!fileFoundForCategory){
                        throw new Error("Atleast 1 certificate required per category.")
                    }
                }

                return true
            }
        }
    } 
}

const cmHeadProfileSchema = { 
    address:addressSchema
}

module.exports = {teacherProfileSchema,cmHeadProfileSchema}