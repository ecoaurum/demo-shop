const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'images');
    },
    filename(req, file, callback) {
        callback(null, new Date().toDateString() + '-' + file.originalname);
    }
});

// Какие форматы изображений разрешены для загрузки
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, callback) => {
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
})