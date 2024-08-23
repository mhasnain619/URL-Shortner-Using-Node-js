const { getUser } = require('../services/auth')

async function restrictToLogedUserOnly(req, res, next) {
    try {
        const userUid = req.cookies?.uid;

        if (!userUid) return res.redirect('/login');

        const user = await getUser(userUid);

        if (!user) return res.redirect('/login');

        req.user = user;
        return next();
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.redirect('/login');
    }
}

module.exports = { restrictToLogedUserOnly }
