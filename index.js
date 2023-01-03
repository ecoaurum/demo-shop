// require('dotenv').config();
const express = require('express');
const path = require('path');
// const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
// const helmet = require('helmet');
const compression = require('compression');
mongoose.set('strictQuery', true);
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const Handlebars = require('handlebars'); //======
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'); // ==========
// const exp = require('constants');
const app = express();
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const keys = require('./keys/index');

const PORT = process.env.PORT || 3000;
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

// const MONGODB_URI = `mongodb+srv://Alex:Kd73PkjwqPSeZQaTA@cluster0.srjy0af.mongodb.net/?retryWrites=true&w=majority`;
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

//Получаем пользователя
// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findById('63a4508750e41a3c2c13f88b');
//         req.user = user;
//         next();
//     } catch (err) {
//         console.log(err);
//     }
// })

//! Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: keys.SESSSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(fileMiddleware.single('avatar'))
// app.use(csrf());
app.use(flash());
// app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

//! Регистрация routes
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);



async function start() {
    try {
        
        await mongoose.connect(keys.MONGODB_URI, {useNewUrlParser: true});
        // Создаем пользователя
        // const candidate = await User.findOne();
        // if (!candidate) {
        //     const  user = new User({
        //         email: 'alex@mail.com',
        //         name: 'Alex',
        //         cart: {items: []}
        //     })
        //     await user.save();
        // }
        app.listen(PORT, (err) => {
            err ? console.log(err) : console.log(`Server running on port http://localhost:${PORT}`);
        })
    } catch(err) {
        console.error(err);
    }
};

start();