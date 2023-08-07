require('dotenv').config();

const express = require('express');
const cors = require('cors')
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/monVieuxGrimoire');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

const authRoutes = require('./routes/auth.routes');
const booksRoutes = require('./routes/books.routes');

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;