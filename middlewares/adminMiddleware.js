
const isAdmin = (req,res,next) => {
  if(req.user.us_permission === 'admin') {
    next();
  }else{
    return res.status(403).json({
      message : 'สิทธิ์การเข้่าใช้งานไม่ถูกต้อง สำหรับ Admin เท่านั้น'
    });
  }
}
module.exports = isAdmin;