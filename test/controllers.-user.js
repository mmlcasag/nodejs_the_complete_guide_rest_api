const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const userController = require('../controllers/user');

describe('/controllers/user', function() {
    
    it('should send a response with a valid user status for an existing user', function(done) {
        mongoose.connect('mongodb+srv://admin:admin@mmlcasag-cvtew.mongodb.net/udemy-rest-api-test', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'password123',
                    name: 'test user',
                    posts: [],
                    _id: '5c0f66b979af55031b34728a'
                });
                return user.save();
            })
            .then(user => {
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
                }

                // calling the function we want to test
                userController.getUserStatus(req, res, () => {})
                    .then(result => {
                        expect(res.statusCode).to.be.equal(200);
                        expect(res.userStatus).to.be.equal('I am new!');
                        done();
                    });
            })
            .catch(err => {
                console.log(err);
            });
    });

});