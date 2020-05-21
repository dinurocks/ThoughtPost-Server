let jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
    try {
        jwt.verify(req.headers.auth, '');
        next();
    } catch(err) {
        console.log(err);
        res.status(401).send({message: "Unauthorized Request"});
    }
}