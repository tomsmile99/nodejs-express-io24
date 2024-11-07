module.exports = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;
  const message = err.message || `เกิดข้อผิดพลาด : ${err}`;
  const validation = err.validation;
  
  return res.status(statusCode).json({
    statusCode : statusCode,
    message : message,
    validation : validation
  })
}