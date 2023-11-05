const profileSchema = {  
    bio:{
        notEmpty:{
            errorMessage:"Description cannot be emtpy."
        },
        isLength:{
            min:10,
            errorMessage:"Atleast 10 characters required."
        }
    },
    address:{
        notEmpty:{
            errorMessage:"Address is required"
        },
        isMongoId:{ 
            errorMessage:"Invalid address."
        }
    },
    teachingCategories:{
        isArray:{
            options:{
                min:1
            },
            errorMessage:"Atleast 1 category required"
        },
        custom: {
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
         
        custom: {
            options:async (value) => { 
                const validateCertificates = value.every(category=>{
                    return category.certificates.every(ele=>{
                        return ele.url!='' && ele.key!=''
                    })
                })

                if(validateCertificates){
                    return true 
                }
                else{
                    throw new Error('Invalid URL/KEY.')
                }
    
            }
        }
    }
       
    

}

module.exports = profileSchema