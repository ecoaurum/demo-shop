const {Router} = require('express');
const {validationResult} = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const {courseValidation} = require('../utils/validators');
const router = Router();

// Рендерим страницу курсов
router.get('/', async(req, res) => {
    try {
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('price title img');

        res.render('courses', {
            title: 'Курсы',
            isCourses: true,
            courses
        });
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id/edit', auth, async (req, res) => {
    if(!req.query.allow) {
        return res.redirect('/');
    }
    

    const course = await Course.findById(req.params.id);

    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    })
});

router.post('/edit', auth, courseValidation, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${id}/edit?allow=true`)
    };


    const {id} = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
});

// Удаление курса
router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id});
        res.redirect('/courses');
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('course', {
        layout: 'empty',
        title:`Курс ${course.title}`,
        course
    })
})

module.exports = router;