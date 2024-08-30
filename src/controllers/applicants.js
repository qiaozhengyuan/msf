const applicantModel = require('../models/applicants');

const getApplicants = async (req, res, next) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const applicants = await applicantModel.getApplicants(limit, offset);
        const totalApplicants = await applicantModel.getApplicantCount();
        res.json({
            total: totalApplicants,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            applicants: applicants,
        });
    } catch (err) {
        next(err);
    }
};

const createApplicant = async (req, res, next) => {
    try {
        const { nric, name, sex, date_of_birth, marital_status, employment_status, household_members } = req.body;
        const applicantData = { nric, name, sex, date_of_birth, marital_status, employment_status };
        const newApplicant = await applicantModel.addNewApplicant(applicantData, household_members);
        res.status(201).json(newApplicant);
    } catch (err) {
        next(err);
    }
};

module.exports = { getApplicants, createApplicant }