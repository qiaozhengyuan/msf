const applicantModel = require('../models/applicants');
const schemeModel = require('../models/schemes');
const { checkEligibility } = require('../util')

const getSchemes = async (req, res, next) => {
    try {
        const { limit = 10, offset = 0 } = req.query;

        const schemes = await schemeModel.getSchemes(limit, offset);
        const totalSchemes = await schemeModel.getSchemeCount();

        res.json({
            total: totalSchemes,
            limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
            schemes: schemes,
        });
    } catch (err) {
        next(err);
    }
};

const getEligibleSchemes = async (req, res, next) => {
    try {
        const { applicant } = req.query;

        const applicantResult = await applicantModel.getApplicantByID(applicant);
        if (!applicantResult) {
            return res.status(404).json({ error: 'Applicant not found' });
        }

        const schemes = await schemeModel.getActiveSchemes();

        const eligibleSchemes = schemes.filter(scheme => checkEligibility(applicantResult, scheme));

        res.json({ eligible_schemes: eligibleSchemes });
    } catch (err) {
        next(err);
    }
};



module.exports = { getSchemes, getEligibleSchemes }