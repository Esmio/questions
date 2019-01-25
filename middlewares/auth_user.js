const JWT = require('jsonwebtoken');
const JWT_SECRET = require('../cipher').JWT_SECRET;
const Errors = require('../errors');

module.exports = function(options) {
    return (req, res, next) => {
        try {
            const auth = req.get('Authorization');
            if(!auth) throw new Errors.AuthError('No auth!');
            let authList = auth.split(' ');
            const token = authList[1];
            if(!auth || auth.length < 2) {
                next(new Errors.AuthError('No auth!'));
                return false;
            }
            const obj = JWT.verify(token, JWT_SECRET);
            if(!obj || !obj._id || !obj.expire) throw new Errors.AuthError('No Auth!')
            if(Date.now() - obj.expire > 0) throw new Errors.AuthError('Token expired')
            next();
        } catch(e) {
            res.statusCode = 401;
            console.log('auth catch', e);
            next(e);
        }
    }
}