const Books = require('../models/books.model');
const utils = require('../utils/utils');

/* check data integrity of books inputs */

module.exports.addBook = (req, res, next) => {
    try {
        const book = JSON.parse(req.body.book);

        // check if all fields are present
        if (
            !book.userId ||
            !book.title  ||
            !book.author ||
            !book.year   ||
            !book.genre  || 
            !Array.isArray(book.ratings) ||
            !book.averageRating ||
            !req.file
        ) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        // transform year from string to number
        book.year = parseInt(book.year);

        // check if user is authenticated
        if (book.userId !== req.auth.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // save book in request
        req.book = book;
        next();
    } catch {
        return res.status(400).json({ error: 'Bad request' });
    }
}

module.exports.updateBook = async (req, res, next) => {
    try {
        const book = req.body.book && (typeof req.body.book === 'string')
            ? JSON.parse(req.body.book)
            : req.body;

        if (
            !book.userId ||
            !book.title  ||
            !book.author ||
            !book.year   ||
            !book.genre
        ) {
            return res.status(400).json({ error: 'Missing fields' });
        }


        if (book.userId !== req.auth.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!(await utils.isOwnerBook(req.auth.userId, req.params.id))) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.book = book;

        const bookId = req.params.id;

        const bookExist = await Books.exists({ _id: bookId });

        if (!bookExist) {
            return res.status(404).json({ error: 'Book not found' });
        }

        next();

    } catch {
        return res.status(400).json({ error: 'Bad request' });
    }
}

module.exports.deleteBook = async (req, res, next) => {
    try {
        if (!(await utils.isOwnerBook(req.auth.userId, req.params.id))) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        next();

    } catch {
        return res.status(400).json({ error: 'Bad request' });
    }
}

module.exports.addRating = async (req, res, next) => {
    try {
        if (!req.body.rating || !Number.isInteger(req.body.rating) || req.body.rating < 1 || req.body.rating > 5) {
            return res.status(400).json({ error: 'Bad request' });
        }

        const bookExist = await Books.exists({ _id: req.params.id });

        if (!bookExist) {
            return res.status(404).json({ error: 'Book not found' });
        }

        next();

    } catch {
        return res.status(400).json({ error: 'Bad request' });
    }
}