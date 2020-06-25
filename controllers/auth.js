const bcrypt = require('bcryptjs');
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
    
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            });

            return user.save();
        })
        .then(user => {
            res.status(201).json({
                message: 'User created successfully',
                user: user
            });
        })
        .catch(err => {
            errorUtils.handleError(err, 500, 'On postSignUp when bcrypting the password');
        });
}

//////////////////////////////////////////////////////////////////////////////////////////