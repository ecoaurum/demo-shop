const {Router} = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {body, validationResult} = require('express-validator');
const keys = require('../keys');
const nodemailer = require('nodemailer');///////////////
const resetEmail = require('../emails/reset');
const {registerValidation} = require('../utils/validators');
// const regEmail = require('../emails/registration');
const router = Router();


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adwordsmytest@gmail.com',
        pass: 'asaedpshcgtytbvv'
    }
});


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    })
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                req.flash('loginError', 'Неверный пароль');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'Такого пользоателя не существует');
            res.redirect('/auth/login#login');
        }
    } catch (err) {
        console.log(err);
    }
    
});

// Регистрация пользователя
router.post('/register', registerValidation, async (req, res) => {
    try {
        const  {email, password, name} = req.body;

        // const candidate = await User.findOne({email});

        // Получаем ошибки, если таковые  имеются при помощи validationResult (из express-validator)
        const errors = validationResult(req);

        // Если ошибка имеется
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            // Говорим,что есть ошибки при помощи статуса 422
            return res.status(422).redirect('/auth/login#register')
        };

        // if (candidate) {
        //     req.flash('registerError', 'Пользователь с таким email уже существует');
        //     res.redirect('/auth/login#register');
        // } else {}

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email, name, password: hashPassword, cart: {items: []}
        })
        // Сохраняем нового пользователя
        await user.save();
        res.redirect('/auth/login#login');
        
    } catch (err) {
        console.log(err);
    }
});

// Если пользователь забыл пароль
// Создаем отдельную страницу, на которую будем перенаправлять пользователя, после нажатия ссылки "Забыли пароль?"
router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль',
        error: req.flash('error')
    })
});

// Страница нового пароля
router.get('/password/:token', async (req, res) => {
    // Если нет пользователя сопределенным токеном
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    // Находим пользователя в БД с этим токеном
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            // Параметр $gt должен быть больше чем текущая дата, иначе - ошибка
            resetTokenExp: {$gt: Date.now()}
        });

        if (!user) {
            return res.redirect('/auth/login');
        } else {
            res.render('auth/password', {
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        };
    
    } catch (err) {
        console.log(err);
    }
});

// Восстановление пароля - отправка письма для восстановления пароля на почту 
router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так. Повторите попытку позже');
                return res.redirect('/auth/reset');
            }
            
            // Парсим инфу из буффера в формат 'hex'
            const token = buffer.toString('hex');
            // сравниваем email полученный от клиента с базой данных
            const candidate = await User.findOne({ email: req.body.email });
            // Если email найден 
            if (candidate) {
                // Если emailы совпали
                candidate.resetToken = token;
                // Устанавливаем время жизни токена 1 час
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
                // Ждем пока сохранится candidate
                await candidate.save();
                // Отправляем письмо про восстановление пароля
                await transporter.sendMail(resetEmail(candidate.email, token));
                res.redirect('/auth/login');
            } else { // иначе если не найден
                req.flash('error', 'Такого email нет');
                res.redirect('/auth/reset')
            }
        })
    } catch (err) {
        console.log(err);
    }
});

// Заканчиваем логику по восстановлению пароля
router.post('/password', async (req, res) => {
    try {
        // Находим пользователя
        const user = await User.findOne({
            // id получаем из token
            _id: req.body.userId,
            resetToken: req.body.token,
            // Обязательно сравниваем время жизни токена
            resetTokenExp: {$gt: Date.now()} 
        });

        if (user) {
            // Если все данные валидны
            user.password = await bcrypt.hash(req.body.password, 10);
            // Удаляем данные, относящиеся к токену восстановления
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            // Ждем плка пользователь сохранится с новыми данными
            await user.save();
            res.redirect('/auth/login');

        } else {
            req.flash('loginError', 'Время жизни токена истекло')
            res.redirect('/auth/login')
        }
    } catch (err) {
        console.log(err);
    }
});
module.exports = router;