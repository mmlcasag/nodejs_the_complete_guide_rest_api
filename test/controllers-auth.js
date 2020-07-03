const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const authController = require('../controllers/auth');

describe('/controllers/auth', function() {

    it('should throw an error with code 500 if accessing the database fails', function() {
        sinon.stub(User, 'findOne');
        User.findOne.throws();
        
        expect(authController.postLogin);

        User.findOne.restore();
    })

});