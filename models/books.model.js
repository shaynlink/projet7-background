const { model, Schema } = require('mongoose');

const bookSchema = new Schema({
    userId: { type: String, required: true, index: true },
    title: String,
    author: String,
    imageUrl: String,
    year: Number,
    genre: String,
    ratings: [{
        userId: String,
        grade: Number
    }],
    averageRating: Number
});

module.exports = model('Book', bookSchema);
