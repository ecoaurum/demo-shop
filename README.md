# demo-shop
This project is an online store with an admin panel, a profile page, password recovery via email, a shopping cart, and the ability to create, delete and edit products.
When developing this project, I used the following technology stack: Node JS, Express, MongoDB, Mongoose. I also used various middleware and a templating engine using Handlebars as an example.
I divided the work on the project into several stages:
1. Start of application development - here I set up the application(ExpressJS), create and listen to the server. I work with asynchronous requests, set up the Template Engine using Handlebars, implement the ability to support multiple pages, and render data.
2. Working with the database - I use the MongoDB database through the MongoDB Atlas service. I connect and configure the database using the Mongoose NPM package. Also create a user model.
3. Sessions and authorization - I add a registration and login page for subsequent authorization of users. Also add and save sessions. 
4. Work with Email - the user can recover his password through the form. Next, the application will send Email to the person and, having a special token, the person will be able to change the password.
5. Profile page - working with files: a profile page for each user has been implemented, where a person can change his profile picture.
