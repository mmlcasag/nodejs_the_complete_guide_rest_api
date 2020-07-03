const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middlewares/auth');

// this is used to organize many tests into a "folder" so to say
// so you can nest all respective tests inside that "folder"
// this makes our code more readable and easier to understand
describe('/middlewares/auth', function() {
    // test #1
    it('should throw an error if no authorization header is present', function() {
        const req = {
            headers: {
                authorization: null
            }
        }
        
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('No token provided');
    });
    
    // test #2
    it('should throw an error if token is not comprised of two parts', function() {
        const req = {
            headers: {
                authorization: 'TokenWithOnlyOnePart'
            }
        }
        
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Token should be comprised of two parts');
    });
    
    // test #3
    it('should throw an error if first part of token is different than Bearer', function() {
        const req = {
            headers: {
                authorization: 'Berro tokenzito'
            }
        }
        
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Token must have a Bearer prefix');
    });
    
    // test #4
    it('should throw an error if the token cannot be verified', function() {
        const req = {
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWZlOGRiMTU0YjhmNjJmYTAwMmFjZTAiLCJlbWFpbCI6ImFiYnlickBnbWFpbC5jb20iLCJpYXQiOjE1OTM3NDA3MzksImV4cCI6MTU5Mzc0NDMzOX0.4RylkK5XdNbS_LnG5_f9fGBnE-PDH7xgGIuPNbwnYwQ'
            }
        }
        
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Invalid token');
    });

    // test #5
    /*
    it('should yield an userId after decoding the token', function() {
        const req = {
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWZlOGRiMTU0YjhmNjJmYTAwMmFjZTAiLCJlbWFpbCI6ImFiYnlickBnbWFpbC5jb20iLCJpYXQiOjE1OTM3NDA3MzksImV4cCI6MTU5Mzc0NDMzOX0.4RylkK5XdNbS_LnG5_f9fGBnE-PDH7xgGIuPNbwnYwQ'
            }
        }
        // how to force the authorization to pass?
        // by overrinding the jwt.verify method, of course!
        jwt.verify = function() {
            return { userId: 'abc' };
        }
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
    });
    */
    // the test passed, but the downside of doing that is that
    // you have replaced the jwt.verify function globally
    // so if you run another test beneath this line of code
    // jwt.verify will never do its proper job again
    // so a more elegant way to solve this problem of mocking
    // a third-party package is to use sinon
    // sinon creates stubs, in which it lets you mock a test
    // and then easily restore the original function so it works
    // on your other tests
    // npm install --save-dev sinon
    // so i will comment the test and re-do it using sinon
    
    // test #5
    it('should yield an userId after decoding the token', function() {
        const req = {
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWZlOGRiMTU0YjhmNjJmYTAwMmFjZTAiLCJlbWFpbCI6ImFiYnlickBnbWFpbC5jb20iLCJpYXQiOjE1OTM3NDA3MzksImV4cCI6MTU5Mzc0NDMzOX0.4RylkK5XdNbS_LnG5_f9fGBnE-PDH7xgGIuPNbwnYwQ'
            }
        }
        // how to force the authorization to pass?
        // using sinon, of course!
        // here we pass the package we want to mock and also the name of the function
        // sinon will replace it with almost an empty function
        sinon.stub(jwt, 'verify');
        // almost because it adds this returns function in which you specify what you want it to return
        jwt.verify.returns({
            userId: 'abc'
        });
        
        authMiddleware(req, {}, () => {});

        expect(jwt.verify.called).to.be.true;
        expect(req).to.have.property('userId');
        
        // now, after running our test and after we are done with it
        // we can restore to the original content
        jwt.verify.restore();
    });
});