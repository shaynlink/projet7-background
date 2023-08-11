require('dotenv').config();

const express = require('express');
const cors = require('cors')
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const mongoose = require('mongoose');

// connect to database
mongoose.connect(process.env.MONGO_URI);

const app = express();

// apply plugins to express
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

const authRoutes = require('./routes/auth.routes');
const booksRoutes = require('./routes/books.routes');

// routes
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;