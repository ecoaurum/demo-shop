const {body} = require('express-validator');
const User = require('../models/user');

// Валидация регистрации
exports.registerValidation = [
    // Валидируем поле email
    body('email')
        .isEmail().withMessage('Введите корректный email')
        .custom( async (value, {req}) => {
            try {
                const user = await User.findOne({email: value}) // или req.body.email вместо value
                if (user) {
                    return Promise.reject('Такой email уже занят');
                }
            } catch (err) {
                console.log(err);
            }
        })
        .normalizeEmail(),// для ввода адекватного email
    // Валидируем поле пароль
    body('password', 'Пароль должен быть минимум 6 символов')
        .isLength({ min: 3, max: 56})
        .isAlphanumeric()
        .trim(),//убираем пробелы
    // Валидируем поле "повторить пароль"
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Пароли должны совпадать')
            }
            return true
        })
        .trim(),
    // Валидируем поле с именем
    body('name')
        .isLength({min: 3}).withMessage('Имя должно быть минимум 3 символа')
        .trim()
];

// Валидация курсов
exports.courseValidation = [
    body('title').isLength({min: 3}).withMessage('Минимаьная длинна названия 3 символа').trim(),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body('img', 'Введите корректный URL картинки').isURL()
]