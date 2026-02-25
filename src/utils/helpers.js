const validator = require("validator");

const validateSignupData = (req) => {
    const {firstName, lastName, emailId, password} = req
    
    if(!firstName || !lastName){
        throw new Error("Please enter your full name")
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid EmailID")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password")
    }
}

const validateEditData = (req) => {
    
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "about", "skills"]
    const keys = Object.keys(req.body)
    
    const isEditAllowed = keys.every(key => allowedEditFields.includes(key))
    
    return isEditAllowed
}

module.exports = {validateSignupData, validateEditData}