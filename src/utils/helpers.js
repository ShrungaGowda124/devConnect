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

module.exports = validateSignupData