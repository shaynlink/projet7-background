const jwt = require('jsonwebtoken');
const Users = require('../models/users.model');

module.exports = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
		const userId = decodedToken.userId;
		req.auth = { userId };

        const userExist = await Users.exists({ _id: userId });

		if (!userExist) {
			throw 'Invalid user ID';
		} else {
			next();
		}
	} catch {
		res.status(401).json({
			error: 'You are not authenticated'
		});
	}
}