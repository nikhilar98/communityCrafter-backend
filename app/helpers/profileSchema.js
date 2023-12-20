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
         
        custom: {  //checking for atleast 1 certificate per category and experience should be greater than 0
            options:async (value,{req}) => { 
               

                const expNotEmpty = value.every(ele=>{
                    return ele.experience!="" 
                })

                const validateExp = value.every(ele=>{
                    return Number(ele.experience)>=0
                })

                if(!expNotEmpty){
                    throw new Error('Experience is required for each category.')
                }
                

                if(!validateExp){ 
                    throw new Error('Experience should be atleast 0')
                }

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