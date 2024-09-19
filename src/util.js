
//   Implemented: Criteria1 && Criteria2 

//   Could be: CriteriaSet1 = Criteria1 || Criteria2 ...
//             Eligibility = CriteriaSet1 && CriteriaSet2 ...


// conditions: {
//     "marital_status":"married",
//     "employment_status":"unemployed"
// },


const checkEligibility = (applicant, scheme) => {
    const { marital_status, employment_status, date_unemployed, household_members } = applicant;

    let isEligible = true;

    for (const criterion of scheme.criteria) {
        if (criterion.applicable_to === "Applicant") {
            if (criterion.marital_status && criterion.marital_status !== marital_status) {
                isEligible = false;
            }
            if (criterion.employment_status && criterion.employment_status !== employment_status) {
                isEligible = false;
            }
            const age_unemployed = calculateAgeInMonth(date_unemployed);
            console.log("Applicant age unemployed", age_unemployed, criterion.age_unemployed_max);
            if (criterion.age_unemployed_max && criterion.age_unemployed_max < age_unemployed) {
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

const calculateAgeInMonth = (dateInEffect) => {
    if (!dateInEffect) {
        return today.getFullYear() * 12;
    }
    const dateie = new Date(dateInEffect);
    const today = new Date();

    let age = today.getFullYear() - dateie.getFullYear();
    const monthDiff = today.getMonth() - dateie.getMonth();

    return age * 12 + monthDiff;
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