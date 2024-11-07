const express = require('express');
const router = express.Router();

/* GET home page. */
// 127.0.0.1:4000/api/v1
router.get('/', function(req, res, next) {
  return res.status(200).json({
    message: 'Hello, Sak Api v1.0.0',
    status: 200,
    data: [] // replace with your data
  })
});

module.exports = router;
