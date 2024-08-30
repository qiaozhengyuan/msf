const dbPool = require("../db")

const getApplications = async (limit, offset) => {
    const result = await dbPool.query(`
        SELECT 
            a.id AS application_id,
            a.applicant_id,
            app.name AS applicant_name,
            a.scheme_id,
            s.name AS scheme_name,
            a.application_status,
            a.created_at AS application_created_at
        FROM Applications a
        JOIN Applicants app ON a.applicant_id = app.id
        JOIN Schemes s ON a.scheme_id = s.id
        ORDER BY a.created_at DESC
        LIMIT $1 OFFSET $2
        `, [limit, offset]);
    return result.rows;
};

const getApplicationCount = async () => {
    const countResult = await dbPool.query('SELECT COUNT(*) FROM Applications');
    return parseInt(countResult.rows[0].count, 10);
};

const addNewApplication = async (applicant_id, scheme_id) => {
    const applicationResult = await dbPool.query(
        `INSERT INTO Applications (applicant_id, scheme_id, application_status) 
        VALUES ($1, $2, $3) RETURNING *`,
        [applicant_id, scheme_id, 'Pending']
    );
    return applicationResult.rows[0];
}

module.exports = { getApplications, getApplicationCount, addNewApplication }