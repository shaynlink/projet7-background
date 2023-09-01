const Book = require('../models/books.model');
const path = require('node:path');
const fs = require('node:fs');

// getURLfromLocalFile: get URL from local file
module.exports.getURLfromLocalFile = (req) => {
    return `${req.protocol}://${req.get('host')}/images/${req.file.modifiedFilename}`;
}

// getLocalFileFromURL: get local file from URL
module.exports.getLocalFileFromURL = (url) => {
    return path.resolve(path.join(__dirname, '..', 'images', url.split('/images/')[1]));
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
module.exports.calculateAverageRating = (ratings) => {
    const ratingsSum = ratings.reduce((acc, rating) => acc + rating.grade, 0);
    return (ratingsSum / (ratings.length)).toFixed(2);
}

// deleteLocalFile: delete local file
module.exports.deleteLocalFile = async (res, filePath) => {
    try {
        // delete file
        await fs.rmSync(filePath);

        // check if file is deleted
        if (fs.existsSync(filePath)) {
            res.status(400).json({ error: 'Cannot delete image' });
            return false;
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Cannot delete image' });
        return false; 
    }

    return true;
}