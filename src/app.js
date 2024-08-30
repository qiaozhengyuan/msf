require('dotenv').config();
const express = require('express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const routes = require('./routes');

const app = express();
app.use(express.json());

// Input validation using OpenAPI
app.use(
    OpenApiValidator.middleware({
        apiSpec: path.join(__dirname, './specs/openapi.json')
    }),
);

// Register routes
app.use('/api', routes);

// Global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.status || 500;
    const message = err.message || 'Unexpected Error';
    res.status(statusCode).json({
        error: message,
        details: err.errors || null,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});