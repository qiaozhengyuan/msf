const applicationModel = require('../models/applications');
const applicantModel = require('../models/applicants');
const schemeModel = require('../models/schemes');
const { checkEligibility } = require('../util')

const getApplications = async (req, res, next) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const applications = await applicationModel.getApplications(limit, offset);
        const totalApplications = await applicationModel.getApplicationCount();
        res.json({
            total: totalApplications,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            applications: applications,
        });
    } catch (err) {
        next(err);
    }
};

const createApplication = async (req, res, next) => {
    try {
        const { applicant_id, scheme_id } = req.body;

        const applicant = await applicantModel.getApplicantByID(applicant_id);
        if (!applicant) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        const scheme = await schemeModel.getSchemeByID(scheme_id);
        if (!scheme) {
            return res.status(404).json({ error: 'Scheme not found or is not active' });
        }

        const isEligible = checkEligibility(applicant, scheme);
        if (!isEligible) {
            return res.status(400).json({ error: 'Applicant is not eligible for this scheme' });
        }

        const application = await applicationModel.addNewApplication(applicant_id, scheme_id);
        res.status(201).json(application);
    } catch (err) {
        next(err);
    }
};


module.exports = { getApplications, createApplication }