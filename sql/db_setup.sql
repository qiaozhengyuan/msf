-- Using PostgreSQL Server 16
-- Create ENUM type for marital status
CREATE TYPE marital_status_enum AS ENUM ('Single', 'Married', 'Widowed', 'Divorced');

-- Create ENUM type for employment status
CREATE TYPE employment_status_enum AS ENUM ('Employed', 'Unemployed');

-- Create table for users
CREATE TABLE Administrators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for applicants
CREATE TABLE Applicants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nric VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sex VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    marital_status marital_status_enum NOT NULL,
    employment_status employment_status_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for household members
CREATE TABLE HouseholdMembers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID REFERENCES Applicants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sex VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    employment_status employment_status_enum NOT NULL
);

-- Create table for schemes
CREATE TABLE Schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scheme_status VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for criteria associated with schemes
CREATE TABLE SchemeCriteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID REFERENCES Schemes(id) ON DELETE CASCADE,
    applicable_to VARCHAR(50),
    marital_status marital_status_enum,
    employment_status employment_status_enum,
    relationship VARCHAR(50),
    age_min INTEGER,
    age_max INTEGER
);

-- Create table for benefits associated with schemes
CREATE TABLE Benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID REFERENCES Schemes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2),
    applicable_to VARCHAR(50),
    criteria_relationship VARCHAR(50),
    criteria_age_min INTEGER,
    criteria_age_max INTEGER
);

-- Create table for applications
CREATE TABLE Applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID REFERENCES Applicants(id) ON DELETE CASCADE,
    scheme_id UUID REFERENCES Schemes(id) ON DELETE CASCADE,
    application_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(applicant_id, scheme_id)
);