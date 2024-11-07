const express = require('express');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const os = require('node:os');
const formData = require('express-form-data');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRoute');
const blogRouter = require('./routes/blogsRoute');

// middleware
const errMiddleware = require('./middlewares/errMiddleware');
const isAuth = require('./middlewares/authMiddleware');



const app = express();
app.use(cors()); // allow all origin
app.use(helmet());
app.use(logger('dev'));
app.use(express.json({limit : '50mb'})); //ทำให้รับฟอร์มรูปแบบ json จาก front-end ได้ ขนาดไม่เกิน 50mb
app.use(formData.parse({ // form-data
  uploadDir: os.tmpdir(),
  autoClean:true
}));
//app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); //สามารถรับ form-data ได้ ต้องลง npm qs ก่อน
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 127.0.0.1:4000/index.html หรือ เปิดให้เข้าถึง Folder ใน public ได้


app.use('/api/v1/', indexRouter); // 127.0.0.1:4000/api/v1/
app.use('/api/v1/users', usersRouter); // 127.0.0.1:4000/api/v1/users
app.use('/api/v1/blogs', [isAuth], blogRouter); // 127.0.0.1:4000/api/v1/blog

// app.use('/api/v2/users', usersRouter2); // 127.0.0.1:4000/api/v2/users
// app.use('/api/v2/blog', blogRouter2); // 127.0.0.1:4000/api/v2/blog


app.use(errMiddleware); // error middleware ให้เอาไว้ล่างสุด

module.exports = app;
