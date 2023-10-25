const mongoose = require('mongoose')

const configDb = async () => { 

    const url =  process.env.DB_URL ||  'mongodb://127.0.0.1:27017'
    const name= process.env.DB_NAME || 'test-app'

   try{
        await mongoose.connect(`${url}/${name}`)
        console.log('Connected to Database.')
    }
    catch(err){
        console.log("Error connecting to database.",err)
    }
}



module.exports = configDb