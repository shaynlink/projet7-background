const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/auth/signup', authCtrl.signup);
router.post('/auth/login', authCtrl.login);

module.exports = router;