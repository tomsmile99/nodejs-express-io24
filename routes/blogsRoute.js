const express = require('express');
const router = express.Router();
const { index } = require('../controllers/blogsController');
const isAuth = require('../middlewares/authMiddleware');

// http://127.0.0.1:4000/api/v1/blogs?page=1&pageSize=5
router.get('/', [isAuth], index);


module.exports = router;
