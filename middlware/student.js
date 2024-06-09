const JWT = require('../model/authentication');

function loginValidation(req, res, next) {
    const { email, test_id } = req.body;
    if (!email || !test_id) {
        return res.status(400).json({ error: 'Enter all necessary data' });
    }
    const admin_id = 'admin' + test_id.slice(4, 9);
    req.body.admin_id = admin_id;
    next();
}

function signupValidation(req, res, next) {
    const test_id = req.query.test_id;
    const {name, email, resume_link} = req.body;
    if(!test_id || !name || !email || !resume_link)
        return res.status(403).json({error:"Enter test id"});
    const admin_id = 'admin' + test_id.slice(4, 9);
    req.body.admin_id = admin_id;
    next();
}

function verifyStudent(req, res, next){
    const token = req.headers.auth;
    if(!JWT.verify(token)){
        return res.status(403).json({error: "You are not valid Student"});
    }

    const {email, test_id} = JWT.get(token);
    if(!email || !test_id)
        return res.status(403).json({error: "Your token expire"});
    next();

}


module.exports = { loginValidation, signupValidation, verifyStudent };