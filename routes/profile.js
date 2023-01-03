const {Router} = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user')
const router = Router();


router.get('/', auth, async (req, res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        // Выводим конкретные данные пользователя
        user: req.user.toObject()
    })
});

router.post('/', auth, async (req, res) => {
    try {
        // Получаем объект пользователя
        const user = await User.findById(req.user._id);

        const toChange = {
            name: req.body.name
        };

        // console.log(req.file);

        if (req.file) {
            toChange.avatarUrl = req.file.path;
        };

        Object.assign(user, toChange);
        await user.save();
        res.redirect('/profile');
    } catch (err) {
        console.log(err);
    }
})


module.exports = router;