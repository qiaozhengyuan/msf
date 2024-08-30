const jwt = require('jsonwebtoken');
const administratorModel = require('../models/administrators');

const mockLogin = async (req, res, next) => {
    try {
        //Note: For illustration purpose only; email should be retrieved from SSO callback
        const { email } = req.body;

        const user = await administratorModel.getAdministratorByEmail(email);

        if (user) {
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '240h' }
            );
            res.status(200).json({ token });
        } else {
            res.status(400).json({ error: 'User does not exist' });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { mockLogin }