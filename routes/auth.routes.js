const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// all routes are prefixed with /api/auth
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;