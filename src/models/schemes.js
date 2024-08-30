const dbPool = require("../db")

const getSchemes = async (limit, offset) => {
    const result = await dbPool.query(`
        SELECT 
            s.id AS scheme_id,
            s.name AS scheme_name,
            s.description AS scheme_description,
            s.scheme_status,
            s.created_at AS scheme_created_at,
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', sc.id,
                    'applicable_to', sc.applicable_to,
                    'marital_status', sc.marital_status,
                    'employment_status', sc.employment_status,
                    'relationship', sc.relationship,
                    'age_min', sc.age_min,
                    'age_max', sc.age_max
                )
            ) AS criteria,
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', b.id,
                    'name', b.name,
                    'amount', b.amount,
                    'applicable_to', b.applicable_to,
                    'criteria_relationship', b.criteria_relationship,
                    'criteria_age_min', b.criteria_age_min,
                    'criteria_age_max', b.criteria_age_max
                )
            ) AS benefits
        FROM Schemes s
        LEFT JOIN SchemeCriteria sc ON s.id = sc.scheme_id
        LEFT JOIN Benefits b ON s.id = b.scheme_id
        GROUP BY s.id
        ORDER BY s.created_at DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return result.rows;
};

const getSchemeCount = async () => {
    const countResult = await dbPool.query('SELECT COUNT(*) FROM Schemes');
    return parseInt(countResult.rows[0].count, 10);
};

const getActiveSchemes = async () => {
    const result = await dbPool.query(`
        SELECT 
            s.id AS scheme_id,
            s.name AS scheme_name,
            s.description AS scheme_description,
            s.scheme_status,
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', sc.id,
                    'applicable_to', sc.applicable_to,
                    'marital_status', sc.marital_status,
                    'employment_status', sc.employment_status,
                    'relationship', sc.relationship,
                    'age_min', sc.age_min,
                    'age_max', sc.age_max
                )
            ) AS criteria,
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', b.id,
                    'name', b.name,
                    'amount', b.amount,
                    'applicable_to', b.applicable_to,
                    'criteria_relationship', b.criteria_relationship,
                    'criteria_age_min', b.criteria_age_min,
                    'criteria_age_max', b.criteria_age_max
                )
            ) AS benefits
        FROM Schemes s
        LEFT JOIN SchemeCriteria sc ON s.id = sc.scheme_id
        LEFT JOIN Benefits b ON s.id = b.scheme_id
        WHERE s.scheme_status = $1
        GROUP BY s.id
    `, ['Active']);
    return result.rows;
}

const getSchemeByID = async (id) => {
    const result = await dbPool.query(`
        SELECT 
            s.id AS scheme_id,
            s.name AS scheme_name,
            s.description AS scheme_description,
            s.scheme_status,
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', sc.id,
                    'applicable_to', sc.applicable_to,
                    'marital_status', sc.marital_status,
                    'employment_status', sc.employment_status,
                    'relationship', sc.relationship,
                    'age_min', sc.age_min,
                    'age_max', sc.age_max
                )
            ) AS criteria,
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', b.id,
                    'name', b.name,
                    'amount', b.amount,
                    'applicable_to', b.applicable_to,
                    'criteria_relationship', b.criteria_relationship,
                    'criteria_age_min', b.criteria_age_min,
                    'criteria_age_max', b.criteria_age_max
                )
            ) AS benefits
        FROM Schemes s
        LEFT JOIN SchemeCriteria sc ON s.id = sc.scheme_id
        LEFT JOIN Benefits b ON s.id = b.scheme_id
        WHERE s.scheme_status = $1 AND s.id = $2
        GROUP BY s.id
    `, ['Active', id]);
    return result.rows[0];
};

module.exports = { getSchemes, getSchemeCount, getActiveSchemes, getSchemeByID }