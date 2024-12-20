// backend/middleware/permissions.js
const permit = require('../config/permit.js');

exports.checkPermission = (action, resource) => async (req, res, next) => {
    const { email } = req.user;
    console.log(email);
    if (!email) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const permitted = await permit.check(email, action, resource);
        if (!permitted) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    } catch (error) {
        console.error('Permission check failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};