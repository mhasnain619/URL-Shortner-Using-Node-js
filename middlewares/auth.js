const { getUser } = require('../services/auth');

async function restrictToLogedUserOnly(req, res, next) {
    try {
        const userUid = req.cookies?.uid;
        console.log('User UID:', userUid);

        if (!userUid) {
            console.log('No UID found in cookies, redirecting to login.');
            return res.redirect('/login');
        }

        const user = await getUser(userUid);
        // console.log('Fetched User:', user);

        if (!user) {
            console.log('No user found, redirecting to login.');
            return res.redirect('/login');
        }

        req.user = user;
        return next();
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.redirect('/login');
    }
}
async function checkAuth(req, res, next) {
    try {
        const userUid = req.cookies?.uid;
        const user = await getUser(userUid);
        req.user = user;
        return next();
    } catch (error) {
        // console.error('Error fetching user:', error);
        return res.redirect('/login');
    }
}

module.exports = { restrictToLogedUserOnly, checkAuth };
