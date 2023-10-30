const profileSchema = {  
    description:{
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
            errorMessage:"Invalid id."
        },
    },
    teachingCategories:{
        isArray:{
            option:{
                min:1
            },
            errorMessage:"Atleast 1 category required"
        },
        custom: async (value) => { 
            const allObjects = value.every(ele=>{
                return typeof ele == 'Object' && Object.keys(ele).includes(['categoryId','years'])
            })

        }
    }
}