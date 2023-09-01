const Books = require('../models/books.model');
const utils = require('../utils/utils');

exports.getBooks = async (req, res) => {
    // get all books
    const books = await Books.find();
    return res.status(200).json(books);
};

exports.getBestRatingBooks = async (req, res) => {
    // get 3 books with best averageRating
    const books = await Books.find().sort({ averageRating: -1 }).limit(3);

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
        // get book by id
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
    // create new book
    const newBook = new Books({
        ...req.book,
        imageUrl: utils.getURLfromLocalFile(req)
    });

    // save book to database
    await newBook.save();

    res.status(200).json({ message: 'Book Created' });
}

exports.updateBook = async (req, res) => {
    const bookId = req.params.id;
    const { imageUrl: oldImageUrl } = await Books.findById(bookId, 'imageUrl');

    if (req.file) {
        req.book = {
            ...req.book,
            imageUrl: utils.getURLfromLocalFile(req)
        };

        const isDone = await utils.deleteLocalFile(res, utils.getLocalFileFromURL(oldImageUrl));

        if (!isDone) return;
    }

    // update book to database by id
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
    const { imageUrl: oldImageUrl } = await Books.findById(bookId, 'imageUrl');

    const isDone = await utils.deleteLocalFile(res, utils.getLocalFileFromURL(oldImageUrl));

    if (!isDone) return;

    // delete book by id
    const result = await Books.findByIdAndDelete(bookId);

    if (!result) {
        return res.status(404).send({
            message: 'Book not found'
        });
    }

    return res.status(200).json({ message: 'Book deleted' });
}

module.exports.addRating = async (req, res, next) => {
    // get book by id
    const book = await Books.findById(req.params.id);

    if (!book) {
        return res.status(404).send({
            message: 'Book not found'
        });
    }

    const ratings = book.ratings;

    // check if user already rated book
    if (book.ratings.some(rating => rating.userId === req.body.userId)) {
        // update rating
        const index = ratings.findIndex(rating => rating.userId === req.body.userId);
        ratings[index].grade = req.body.rating;
    } else {
        // add new rating
        ratings.push({
            userId: req.body.userId,
            grade: req.body.rating
        });
    }

    // update book with new rating and average rating
    const result = await Books.updateOne(
        { _id: req.params.id },
        { 
            $set: {
                // calculate new average rating
                averageRating: utils.calculateAverageRating(ratings),
                ratings
            }
        },
    );

    if (result.modifiedCount < 1) {
        return res.status(404).send({
            message: 'Book not modified'
        });
    }

    // get book by id
    const newBook = await Books.findById(req.params.id);

    return res.status(200).json(newBook);
}