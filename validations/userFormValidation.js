const { check } = require('express-validator');

exports.checkFormUserRegister = [
  check('us_fullname_form').trim()
  .notEmpty().withMessage('กรุณากรอกชื่อ-นามสกุล'),

  check('us_email_form').trim()
  .isEmail().withMessage('รูปแบบอีเมล์ไม่ถูกต้อง')
  .notEmpty().withMessage('กรุณากรอกอีเมล์'),

  check('us_password_form').trim()
  .isLength({ min: 6 }).withMessage('กรุณาตั้ง Password อย่างน้อย 6 ตัวอักษรขึ้นไป')
  .notEmpty().withMessage('กรุณากรอก Password')
]


exports.checkFormUserLogin = [
  check('us_email_form').trim()
  .isEmail().withMessage('รูปแบบอีเมล์ไม่ถูกต้อง')
  .notEmpty().withMessage('กรุณากรอกอีเมล์'),

  check('us_password_form').trim()
  .notEmpty().withMessage('กรุณากรอก Password')
]