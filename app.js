require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors')
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const initializeMongo = require('./models');

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

const authRoutes = require('./routes/auth.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');

initializeMongo(app);

app.use('/api/auth/signup', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
module.exports = app;