const checkEligibility = (applicant, scheme) => {
    const { marital_status, employment_status, household_members } = applicant;

    let isEligible = true;

    for (const criterion of scheme.criteria) {
        if (criterion.applicable_to === "Applicant") {
            if (criterion.marital_status && criterion.marital_status !== marital_status) {
                isEligible = false;
            }
            if (criterion.employment_status && criterion.employment_status !== employment_status) {
                isEligible = false;
            }
        } else if (criterion.applicable_to === "Household member") {
            const found = household_members.find(member => {
                if (criterion.relationship && criterion.relationship !== member.relationship) {
                    return false;
                }
                if (criterion.employment_status && criterion.employment_status !== member.employment_status) {
                    return false;
                }
                const age = calculateAge(member.date_of_birth);
                if (criterion.age_min && age < criterion.age_min) {
                    return false;
                }
                if (criterion.age_max && age > criterion.age_max) {
                    return false;
                }
                return true;
            })

            if (!found) {
                isEligible = false;
            }
        }
        if (!isEligible) break;
    }

    return isEligible;
};

const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
};

module.exports = { checkEligibility }