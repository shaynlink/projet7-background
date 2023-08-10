const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');

// Create a schema
const schema = new passwordValidator();

exports.signup = async (req, res) => {
	// check if email and password are present
	if(!req.body.email || !req.body.password){
		return res.status(400).send({
			message: 'Must have email and password'
		});
	}

	// check if email is valid
	if (!emailValidator.validate(req.body.email)) {
		return res.status(400).send({
			message: 'Invalid email'
		});
	}

	const password = req.body.password;

	// check if password is valid
	if (!schema.validate(password)) {
		return res.status(400).send({
			message: 'Invalid password'
		});
	}

	try {
		// create hash password
		const hash = await bcrypt.hash(req.body.password, 10)
		const user = {
			email: req.body.email,
			password: hash
		}
		// create new user
		const users = new Users(user);
		// save user
		await users.save();

		return res.status(200).json({ message: 'User Created' })
	} catch (err) {
		return res.status(500).send({
			message: err.message
		});
	}
}

exports.login = async (req, res) => {
	// get user by email
	const user = await Users.findOne({ email: req.body.email });
	// check if user exists
 	if(user === null) {
		return res.status(404).json({ error: 'user not found' })
	} else {
		// check if password is valid
		const valid = await bcrypt.compare(req.body.password, user.password)
		if(!valid){
			return res.status(401).json({ error: 'Not Authorized' })
		}
		return res.status(200).json({
			userId: user._id,
			token: jwt.sign(
				{ userId : user._id },
				process.env.TOKEN_SECRET,
				{ expiresIn: '24h' }
			)
		})
	}
}