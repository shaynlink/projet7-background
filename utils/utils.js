const Book = require('../models/books.model');

// getURLfromLocalFile: get URL from local file
module.exports.getURLfromLocalFile = (req) => {
    return `${req.protocol}://${req.get('host')}/images/${req.file.modifiedFilename}`;
}

// isValidMimyType: check if mimeType is valid
module.exports.isValidMimyType = (mimeType) => {
    const validMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
    return validMimeTypes.includes(mimeType);
}

// isOwnerBook: check if user is owner of book
module.exports.isOwnerBook = async (userId, bookId) => {
    const exist = await Book.exists({ _id: bookId, userId });
    return exist;
}

// calculateAverageRating: calculate average rating
module.exports.calculateAverageRating = (ratings, newRating) => {
    const ratingsSum = ratings.reduce((acc, rating) => acc + rating.grade, 0) + newRating;
    return (ratingsSum / (ratings.length + 1)).toFixed(2)
}