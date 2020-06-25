const { validationResult } = require("express-validator");

const User = require('../models/user');
const errorUtils = require('../utils/error');

//////////////////////////////////////////////////////////////////////////////////////////

module.exports.postSignUp = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        errorUtils.throwNewError('Validation failed, entered data is incorrect', 422, errors.array());
    }
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    
}

//////////////////////////////////////////////////////////////////////////////////////////