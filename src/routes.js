const express = require('express');
const { onlyAdmin } = require('./middleware');
const {
    getApplicants,
    createApplicant,
} = require('./controllers/applicants');

const {
    getApplications,
    createApplication,
} = require('./controllers/applications');

const {
    getSchemes,
    getEligibleSchemes,
} = require('./controllers/schemes');

const { mockLogin } = require('./controllers/auth');

const router = express.Router();

// Applicants endpoints
router.get('/applicants', onlyAdmin, getApplicants);
router.post('/applicants', onlyAdmin, createApplicant);

// Schemes endpoints
router.get('/schemes', onlyAdmin, getSchemes);
router.get('/schemes/eligible', onlyAdmin, getEligibleSchemes);

// Applications endpoints
router.get('/applications', onlyAdmin, getApplications);
router.post('/applications', onlyAdmin, createApplication);

router.post('/mockLogin', mockLogin);

module.exports = router;