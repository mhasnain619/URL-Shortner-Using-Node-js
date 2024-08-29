const { getUser } = require('../services/auth');

async function restrictToLogedUserOnly(req, res, next) {
    try {
        const userUid = req.headers['authorization'];

        if (!userUid) {
            return res.redirect('/login');
        }

        const token = userUid.split('Bearer ')[1]

        const user = await getUser(token);
        // console.log('Fetched User:', user);

        if (!user) {
            // console.log('No user found, redirecting to login.');
            return res.redirect('/login');
        }

        req.user = user;
        return next();
    } catch (error) {
        // console.error('Error fetching user:', error);
        return res.redirect('/login');
    }
}
async function checkAuth(req, res, next) {
    try {
        const userUid = req.headers['authorization'];
        const token = userUid.split('Bearer ')[1]

        const user = await getUser(token);
        req.user = user;
        return next();
    } catch (error) {
        // console.error('Error fetching user:', error);
        return res.redirect('/login');
    }
}

module.exports = { restrictToLogedUserOnly, checkAuth };
