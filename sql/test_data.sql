INSERT INTO
    Administrators(email, role)
VALUES
    ('z@z.com', 'admin');

INSERT INTO
    Schemes (name, description, scheme_status)
VALUES
    (
        'Retrenchment Assistance Scheme',
        'Financial assistance for retrenched workers',
        'Active'
    );

DO $$ DECLARE scheme_id UUID;

BEGIN
SELECT
    id INTO scheme_id
FROM
    Schemes
WHERE
    name = 'Retrenchment Assistance Scheme';

INSERT INTO
    SchemeCriteria (scheme_id, applicable_to, employment_status)
VALUES
    (
        scheme_id,
        'Applicant',
        'Unemployed'
    );

INSERT INTO
    Benefits (scheme_id, name, amount, applicable_to)
VALUES
    (
        scheme_id,
        'SkillsFuture Credits',
        500.00,
        'Applicant'
    );

INSERT INTO
    Benefits (
        scheme_id,
        name,
        amount,
        applicable_to,
        criteria_relationship,
        criteria_age_min,
        criteria_age_max
    )
VALUES
    (
        scheme_id,
        'Daily School Meal Vouchers',
        10.00,
        'Household member',
        'Child',
        6,
        12
    );

END $$;