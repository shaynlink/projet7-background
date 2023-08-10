const Book = require('../models/books.model');

module.exports.transformBinaryToDataURL = (mimeType, buffer) => {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

module.exports.isValidMimyType = (mimeType) => {
    const validMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
    return validMimeTypes.includes(mimeType);
}

module.exports.isOwnerBook = async (userId, bookId) => {
    const exist = await Book.exists({ _id: bookId, userId });
    return exist;
}

module.exports.calculateAverageRating = (ratings, newRating) => {
    const ratingsSum = ratings.reduce((acc, rating) => acc + rating.grade, 0) + newRating;
    return ratingsSum / (ratings.length + 1);
}