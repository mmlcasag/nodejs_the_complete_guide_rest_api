const User = require('../models/user');

const errorUtils = require('../utils/error');

module.exports.getUserStatus = (req, res, next) => {
    const userId = req.userId;

    User.findById(userId)
        .then(user => {
            if (!user) {
                errorUtils.throwNewError('Validation failed', 404, 'The request user was not found');
            }

            res.status(200).json({
                message: 'User data fetched successfully',
                status: user.status
            });
        })
        .catch(err => {
            errorUtils.handleError(err, 500, 'On getUserStatus at User.findById');
        });
}

module.exports.patchUserStatus = (req, res, next) => {
    const userId = req.userId;
    const status = req.body.status;

    if (!status) {
        errorUtils.throwNewError('Validation failed', 422, 'Status is required');
    }

    User.findById(userId)
        .then(user => {
            if (!user) {
                errorUtils.throwNewError('Validation failed', 404, 'The request user was not found');
            }

            user.status = status;
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'User status updated successfully',
                status: status
            });
        })
        .catch(err => {
            errorUtils.handleError(err, 500, 'On getUserStatus at User.findById');
        });
}