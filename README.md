
# Financial Assistance Scheme Management System

## Overview

This project is a backend implementation for managing financial assistance schemes for needy individuals and families. It includes functionalities for managing applicants, applications, and schemes, along with administrative user roles.

## Features

- **Applicants Management**: Add and view applicants, including their household members.
- **Schemes Management**: View all available financial assistance schemes.
- **Applications Management**: Create and view applications for schemes based on applicant eligibility.
- **Eligibility Checking**: Automatically checks applicant eligibility for schemes based on criteria.
- **Authentication**: JWT-based authentication for secure access to the API.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **API Documentation & Input Validation**: OpenAPI

## Prerequisites

- Node.js (v20)
- PostgreSQL (v16)
- NPM (v10)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>
   JWT_SECRET=<your-secret-key>
   PORT=3000
   ```

4. Setup DB schema:
   - Execute the SQL script located at `sql/db_setup.sql` to create the necessary database schema.
   - Ensure that your database account has write access to all the tables created by this script.

5. (Optional) Insert Sample Data:
   - You can optionally create a sample scheme and administrator by executing the `sql/test_data.sql` script.

5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- **POST /api/mockLogin**
  - Mock login to generate JWT token.

### Applicants

- **GET /api/applicants**
  - Retrieve all applicants with pagination.
- **POST /api/applicants**
  - Create a new applicant.

### Schemes

- **GET /api/schemes**
  - Retrieve all schemes with pagination.
- **GET /api/schemes/eligible?applicant={id}**
  - Retrieve all schemes that an applicant is eligible to apply for.

### Applications

- **GET /api/applications**
  - Retrieve all applications with pagination.
- **POST /api/applications**
  - Create a new application.

## Database Schema

The system uses the following tables:

- **Administrators**: Information about users managing the system.
- **Applicants**: Details of individuals applying for financial assistance.
- **HouseholdMembers**: Family members staying in the same household as the applicant.
- **Schemes**: Information about available financial assistance schemes.
- **SchemeCriteria**: Criteria associated with schemes for eligibility checking.
- **Benefits**: Benefits associated with each scheme.
- **Applications**: Records and statuses of applications made by applicants.

## License

This project is licensed under the GPL V3 License.