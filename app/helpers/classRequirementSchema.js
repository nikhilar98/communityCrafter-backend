const classRequirementSchema =  {
    title:{
        notEmpty:{
            errorMessage:"Category cannot be empty."
        },
        isLength:{
            options:{
                min:2
            },
            errorMessage:"Minimum 2 characters required."
        }
    },
    categoryId:{
        notEmpty:{
            errorMessage:"Category cannot be empty."
        },
        isMongoId:{
            errorMessage:"Invalid category Id."
        }
    },
    batchSizeRange:{
        notEmpty:{
            errorMessage:"Batch size cannot be empty."
        },
        isIn:{
            options:[['1','2-4','5-8','8-12']],
            errorMessage:"Not a valid batch size."
        }
    },
    payOffered: {
        notEmpty:{
            errorMessage:"Pay offered cannot be empty."
        },
        isInt:{
            options:{ 
                min:0
            },
            errorMessage:"Invalid pay."
        }
    },  
    desiredTimeSlot:{
        notEmpty:{
            errorMessage:"desiredTimeSlot cannot be empty."
        },
        custom:{
            options: async (value)=>{
                const [startHour,endHour] = value.split('-').map(ele=>Number(ele.split(":")[0]))
                if(startHour>=endHour){
                    throw new Error("Start time has to be before end time.")
                }
                else { 
                    return true
                }
            }
        }

    } ,
    weekdays:{
        isArray:{
            options:{
                min:2
            },
            errorMessage:"Minimum 2 weekdays required."
        },
        custom:{
            options: async (value)=>{
                const validateDays = value.every(ele=>{
                    return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].includes(ele)
                })
                if(validateDays){
                    return true
                }
                else { 
                    throw new Error('Invalid weekday.')
                }
            }
        }
    },
    commencementDate:{
        notEmpty:{
            errorMessage:"commencement date cannot be empty."
        },
        isDate:{
            errorMessage:"Invalid Date."
        },
        custom:{
            options:(value)=>{
                const result = new Date(value) > new Date()
                if(result) { 
                    return true
                }
                else { 
                    throw new Error('Commencement day should be greater than current date.')
                }
            }
        }
    } ,
    duration:{
        notEmpty:{
            errorMessage:"Duration cannot be empty."
        },
        isInt:{
            options:{ 
                min:1
            },
            errorMessage:"Duration should be atleast 1 month."
        }
    },
    description:{
        notEmpty:{
            errorMessage:"Description cannot be empty."
        },
        isLength:{
            options:{
                min:10
            },
            errorMessage:"Minimum 10 characters required."
        }
    }                             
                              

}

module.exports = classRequirementSchema