const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const authController = require('../controllers/auth');

describe('/controllers/auth', function() {

    it('should throw an error with code 500 if accessing the database fails', function(done) {
        // overwrites the User.findOne method
        sinon.stub(User, 'findOne');
        // for a function that always throws an error
        User.findOne.throws();
        
        // here we are mocking the request object
        const req = {
            body: {
                email: 'test@test.com',
                password: 'password123'
            }
        }

        // here we make the call to the controller
        // a very important detail here
        // since this is an asynchronous function
        // you have to call the done() function
        // so mocha will know it has to wait until the end of the asynchronous code
        // also in the it() signature, you have to pass done as an argument to the function
        // i.e.: it('name of the unit test', function(done)) { ... }
        authController.postLogin(req, {}, () => {})
            .then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('status', 500);
                done();
            });
        
        // after you are done testing, restore the original method you have mocked
        User.findOne.restore();
    })

});