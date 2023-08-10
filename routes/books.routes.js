const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books.controller');
const multer = require('multer');
const auth = require('../middlewares/auth');
const checkInput = require('../middlewares/checkInput');
const upload = multer();

// all routes are prefixed with /api/books
router.get('/', booksCtrl.getBooks);
router.get('/bestrating', booksCtrl.getBestRatingBooks);
router.get('/:id', booksCtrl.getBookById);
router.post('/', auth, upload.single('image'), checkInput.addBook, booksCtrl.addBook);
router.post('/:id/rating', checkInput.addRating, booksCtrl.addRating);
router.put('/:id', auth, upload.single('image'), checkInput.updateBook, booksCtrl.updateBook);
router.delete('/:id', auth, checkInput.deleteBook, booksCtrl.deleteBook);

module.exports = router;