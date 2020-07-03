const expect = require('chai').expect;

const authMiddleware = require('../middlewares/auth');

it('should throw an error if no authorization header is present', function() {
    const req = {
        headers: {
            authorization: null
        }
    }
    
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('No token provided');
});

it('should throw an error if token is not comprised of two parts', function() {
    const req = {
        headers: {
            authorization: 'TokenWithOnlyOnePart'
        }
    }
    
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Token should be comprised of two parts');
});

it('should throw an error if first part of token is different than Bearer', function() {
    const req = {
        headers: {
            authorization: 'Berro tokenzito'
        }
    }
    
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Token must have a Bearer prefix');
});

it('should not throw any error', function() {
    const req = {
        headers: {
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWZlOGRiMTU0YjhmNjJmYTAwMmFjZTAiLCJlbWFpbCI6ImFiYnlickBnbWFpbC5jb20iLCJpYXQiOjE1OTM3NDA3MzksImV4cCI6MTU5Mzc0NDMzOX0.4RylkK5XdNbS_LnG5_f9fGBnE-PDH7xgGIuPNbwnYwQ'
        }
    }
    
    expect(authMiddleware.bind(this, req, {}, () => {})).to.not.throw();
});