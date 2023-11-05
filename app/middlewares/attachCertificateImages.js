const multer = require('multer')
const upload = multer()
const attachCertificateImages = (req,res,next)=>{
    const categoryFields = JSON.parse(req.body.teachingCategories).map(ele=>({name:ele.categoryId}))  //for generating dyncamic fields array
    req.certificateFields = categoryFields 
    upload.fields(req.certificateFields) //dynamic fields array passed - this middleware attached files object to the request object
    console.log('checkpoint 0')
    next()
}

module.exports = attachCertificateImages