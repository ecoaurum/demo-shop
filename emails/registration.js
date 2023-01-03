const keys = require('../keys');


module.exports = function(email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Аккаунт создан',
        // text: 'and easy to do anywhere, even with Node.js',
        html: `
            <h1>Добро пожаловать в наш магазин</h1>
            <p>Вы успешно создали аккаунт с email - ${email}</p>
            <hr />
            <a href="${keys.BASE_URL}">Магазин курсов - Главная</a>
        `
    }
};