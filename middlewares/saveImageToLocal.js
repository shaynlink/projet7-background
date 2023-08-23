const sharp = require('sharp');
const path = require('node:path');
const utils = require('../utils/utils');

module.exports = async (req, res, next) => {
    // chek if mime type is valid 
    if (!utils.isValidMimyType(req.file.mimetype)) {
        return res.status(400).send({
            message: 'Invalid file type'
        });
    }

    const filename = req.file.originalname.split(' ').join('_');
    const filenameArray = filename.split('.');
    filenameArray.pop();
    const filenameWithoutExtention = filenameArray.join('.');
    const modifiedFilename = filenameWithoutExtention + '_ '+ Date.now() + '.webp';

    sharp(req.file.buffer)
        .toFile(
            path.join(__dirname, '..', 'images', modifiedFilename),
            (err, info) => {
                if (err) {
                    console.error(err);
                    return res.status(400).json({ error: 'Something wrong with image' });
                }

                req.file.modifiedFilename = modifiedFilename;

                next();
            }
        );
}
