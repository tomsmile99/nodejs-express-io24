const express = require('express');
const router = express.Router();


const { index, showUser, searchUser, registerUser, register2User, loginUser, updateUser, deleteUser, userProfile } = require('../controllers/usersController');
const { checkFormUserRegister, checkFormUserLogin } = require('../validations/userFormValidation');
const isAuth = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');


// 127.0.0.1:4000/users/info
// router.get('/info', function(req, res, next) {
//   res.send('respond with a resource info');
// });

/* GET users listing. */
// 127.0.0.1:4000/api/v1/users
router.get('/', [isAuth,isAdmin], index);
router.get('/profile', [isAuth], userProfile);

router.get('/search', [isAuth], searchUser);

router.get('/:id', [isAuth], showUser);

router.post('/login', checkFormUserLogin, loginUser);
router.post('/register', checkFormUserRegister, registerUser);
router.post('/register2', register2User);

router.put('/update/:id', [isAuth], updateUser);

router.delete('/delete/:id', [isAuth], deleteUser); 


module.exports = router;
