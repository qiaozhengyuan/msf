const dbPool = require("../db")

const getAdministratorByEmail = async (email) => {
    const result = await dbPool.query('SELECT * FROM Administrators WHERE email = $1', [email]);
    return result.rows[0];
};

module.exports = { getAdministratorByEmail }