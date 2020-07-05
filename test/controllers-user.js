const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const userController = require('../controllers/user');

describe('/controllers/user', function() {
    
    // this runs before our tests
    // not before every test
    // but before all test cases inside this describe()
    before(function(done) {
        // connects to the test database
        mongoose.connect('mongodb+srv://admin:admin@mmlcasag-cvtew.mongodb.net/udemy-rest-api-test', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
            .then(result => {
                // creates a dummy user
                const user = new User({
                    email: 'test@test.com',
                    password: 'password123',
                    name: 'test user',
                    posts: [],
                    _id: '5c0f66b979af55031b34728a'
                });
                // stores it in the database
                return user.save();
            })
            .then(result => {
                // this tells mocha that we are done with our initialization
                // and so it will proceed running our tests
                done();
            });
    });
    
    // this runs before every test case
    beforeEach(function() {
        console.log('before running the next test case');
    });

    it('should send a response with a valid user status for an existing user', function(done) {
        // creating a mock request object
        const req = {
            userId: '5c0f66b979af55031b34728a'
        };

        // creating a mock response object
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStatus = data.status;
            }
        };

        // calling the function we want to test
        userController.getUserStatus(req, res, () => {})
            .then(result => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal('I am new!');
                done();
            });
    });

    // this runs after every test case
    afterEach(function() {
        console.log('after running the previous test case');
    });

    // after will run just after all your test cases
    after(function(done) {
        // after we are done with our tests
        // we need to delete the user we created in the initialization
        // otherwise next time we run this test it will fail
        // because the user already exists in the database
        // therefore we will get a duplicate id eroor
        User.deleteMany({})
            .then(result => {
                // maybe you noticed that sometimes even though you are calling done()
                // you are stuck in execution mode and you need to type ctrl+c to quit
                // why?
                // because our database connection is still open
                // how to handle this?
                return mongoose.disconnect();
            })
            .then(result => {
                done();
            });
    });

});