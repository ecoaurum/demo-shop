const {Schema, model} = require('mongoose');

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

courseSchema.method('toClient', function() {
    const course = this.toObject();

    course.id = course._id;
    delete course._id;
    return course;
})

module.exports = model('Course', courseSchema);






// Старый код, до подключения БД
// const { v4: uuidv4 } = require('uuid');
// const fs = require('fs');
// const path = require('path');

// class Course {
//     constructor(title, price, img) {
//         this.title = title;
//         this.price = price;
//         this.img = img;
//         this.id = uuidv4();
//     };

//     toJSON() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id
//         }
//     };

//     static async update(course) {
//         const courses = await Course.getAll();

//         const idx = courses.findIndex(c => c.id === course.id);
//         courses[idx] = course;

//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if(err) {
//                         reject(err)
//                     } else {
//                         resolve()
//                     }
//                 }
//             )
//         })
//     }

//     async save() {
//         const courses = await Course.getAll();
//         courses.push(this.toJSON());

//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if(err) {
//                         reject(err)
//                     } else {
//                         resolve()
//                     }
//                 }
//             )
//         })
//     };

//     static getAll() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if(err) {
//                         reject(err)
//                     } else {
//                         resolve(JSON.parse(content));
//                     }
//                 }
//             );
//         });
//     };
//     static async getById(id) {
//         const courses = await Course.getAll();
//         return courses.find(c => c.id === id)
//     }
// };

// module.exports = Course;