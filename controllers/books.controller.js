const Books = require('../models/books.model');
const utils = require('../utils/utils');

exports.getBooks = async (req, res) => {
    const books = await Books.find();
    return res.status(200).json(books);
};

exports.getBestRatingBooks = async (req, res) => {
    const books = await Books.find().sort({ rating: -1 }).limit(3);

    if (!books) {
        return res.status(404).send({
            message: 'Books not found'
        });
    }

    return res.status(200).json(books);
};

exports.getBookById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({
            message: 'Must have id'
        });
    }

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send({
            message: 'Invalid id'
        });
    }

    try {
        const book = await Books.findById(req.params.id);
    
        if (!book) {
            return res.status(404).send({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);
    } catch (err) {
        return res.status(500).send({
            message: err.message
        });
    }
}

exports.addBook = async (req, res) => {    
    if (!utils.isValidMimyType(req.file.mimetype)) {
        return res.status(400).send({
            message: 'Invalid file type'
        });
    }

    const imageUrl = utils.transformBinaryToDataURL(req.file.mimetype, req.file.buffer);

    const newBook = new Books({
        ...req.book,
        imageUrl: imageUrl
    });

    await newBook.save();

    res.status(200).json({ message: 'Book Created' });
}

exports.updateBook = async (req, res) => {
    const bookId = req.params.id;

    if (req.file) {
        if (!utils.isValidMimyType(req.file.mimetype)) {
            return res.status(400).send({
                message: 'Invalid file type'
            });
        }

        const imageUrl = utils.transformBinaryToDataURL(req.file.mimetype, req.file.buffer);

        req.book = {
            ...req.book,
            imageUrl: imageUrl
        };
    }

    const result = await Books.findByIdAndUpdate(bookId, req.book, { new: true, upsert: false });

    if (!result) {
        return res.status(404).send({
            message: 'Book not found'
        });
    }

    return res.status(200).json({ message: 'Book updated' });
};

module.exports.deleteBook = async (req, res) => {
    const bookId = req.params.id;

    const result = await Books.findByIdAndDelete(bookId);

    if (!result) {
        return res.status(404).send({
            message: 'Book not found'
        });
    }

    return res.status(200).json({ message: 'Book deleted' });
}

module.exports.addRating = async (req, res, next) => {
    const book = await Books.findById(req.params.id);

    if (!book) {
        return res.status(404).send({
            message: 'Book not found'
        });
    }

    const ratings = book.ratings;

    if (book.ratings.some(rating => rating.userId === req.body.userId)) {
        const index = ratings.findIndex(rating => rating.userId === req.body.userId);
        ratings[index].grade = req.body.rating;
    } else {
        ratings.push({
            userId: req.body.userId,
            grade: req.body.rating
        });
    }

    const result = await Books.updateOne(
        { _id: req.params.id },
        { 
            $set: {
                averageRating: utils.calculateAverageRating(book.ratings, req.body.rating),
                ratings
            }
        },
    );

    if (result.modifiedCount < 1) {
        return res.status(404).send({
            message: 'Book not found'
        });
    }

    const newBook = await Books.findById(req.params.id);

    return res.status(200).json(newBook);
}