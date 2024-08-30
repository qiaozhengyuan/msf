const dbPool = require("../db")

const getApplicants = async (limit, offset) => {
    const result = await dbPool.query(`
        SELECT 
            a.id AS applicant_id,
            a.nric,
            a.name AS applicant_name,
            a.sex AS applicant_sex,
            TO_CHAR(a.date_of_birth, 'YYYY-MM-DD') AS applicant_date_of_birth,
            a.marital_status,
            a.employment_status,
            a.created_at AS applicant_created_at,
            json_agg(
                json_build_object(
                    'id', h.id,
                    'name', h.name,
                    'sex', h.sex,
                    'date_of_birth', TO_CHAR(h.date_of_birth, 'YYYY-MM-DD'),
                    'relationship', h.relationship,
                    'employment_status', h.employment_status
                )
            ) AS household_members
        FROM Applicants a
        LEFT JOIN HouseholdMembers h ON a.id = h.applicant_id
        GROUP BY a.id
        ORDER BY a.created_at DESC
        LIMIT $1 OFFSET $2
    `, [limit, offset]);
    return result.rows;
};

const getApplicantCount = async () => {
    const countResult = await dbPool.query('SELECT COUNT(*) FROM Applicants');
    return parseInt(countResult.rows[0].count, 10);
};

const addNewApplicant = async (applicant, household_members) => {
    const client = await dbPool.connect();
    await client.query('BEGIN'); // Begin transaction
    try {
        const { nric, name, sex, date_of_birth, marital_status, employment_status } = applicant;

        const applicantResult = await client.query(
            `INSERT INTO Applicants 
            (nric, name, sex, date_of_birth, marital_status, employment_status) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [nric, name, sex, date_of_birth, marital_status, employment_status]
        );
        const createdApplicant = applicantResult.rows[0];

        let householdMembers = [];
        if (household_members && household_members.length > 0) {
            const householdInsertPromises = household_members.map((member) => {
                return client.query(
                    `INSERT INTO HouseholdMembers 
                    (applicant_id, name, sex, date_of_birth, relationship, employment_status) 
                    VALUES ($1, $2, $3, $4, $5, $6) 
                    RETURNING *`,
                    [
                        createdApplicant.id,
                        member.name,
                        member.sex,
                        member.date_of_birth,
                        member.relationship,
                        member.employment_status,
                    ]
                );
            });
            const householdInsertResults = await Promise.all(householdInsertPromises);
            householdMembers = householdInsertResults.map(result => result.rows[0]);
        }

        await client.query('COMMIT'); // Commit transaction

        return {
            id: createdApplicant.id,
            nric: createdApplicant.nric,
            name: createdApplicant.name,
            sex: createdApplicant.sex,
            date_of_birth: createdApplicant.date_of_birth,
            marital_status: createdApplicant.marital_status,
            employment_status: createdApplicant.employment_status,
            created_at: createdApplicant.created_at,
            household_members: householdMembers,
        };
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        throw err;
    } finally {
        client.release();
    }
};

const getApplicantByID = async (id) => {
    const result = await dbPool.query(`
        SELECT 
            a.id AS applicant_id,
            a.nric,
            a.name AS applicant_name,
            a.sex AS applicant_sex,
            a.date_of_birth AS applicant_date_of_birth,
            a.marital_status,
            a.employment_status,
            json_agg(
                json_build_object(
                    'id', h.id,
                    'name', h.name,
                    'sex', h.sex,
                    'date_of_birth', h.date_of_birth,
                    'relationship', h.relationship,
                    'employment_status', h.employment_status,
                    'age', EXTRACT(YEAR FROM age(h.date_of_birth))
                )
            ) AS household_members
        FROM Applicants a
        LEFT JOIN HouseholdMembers h ON a.id = h.applicant_id
        WHERE a.id = $1
        GROUP BY a.id
    `, [id]);
    return result.rows[0];
};

module.exports = { getApplicants, getApplicantCount, addNewApplicant, getApplicantByID }