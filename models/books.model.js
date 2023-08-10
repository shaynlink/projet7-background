const { model, Schema } = require('mongoose');

const bookSchema = new Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{
        userId: { type: String, required: true },
        grade: { type: Number, required: true }
    }],
    averageRating: { type: Number, required: true }
});

module.exports = model('Book', bookSchema);
