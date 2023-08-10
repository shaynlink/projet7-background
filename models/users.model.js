const { model, Schema } = require('mongoose');

// define the schema for our user model
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = model('User', userSchema);
