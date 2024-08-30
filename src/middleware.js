const jwt = require('jsonwebtoken');

const onlyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        if (user.role !== "admin") return res.sendStatus(401);
        req.user = user;
        next();
    });
};

module.exports = {
    onlyAdmin,
};