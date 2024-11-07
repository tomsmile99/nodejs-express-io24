const blogsModel = require('../model/blogsModel');
const usersModel = require('../model/usersModel');


exports.index = async (req, res, next) => {
  try {
    // แบบ Pagination
    // http://127.0.0.1:4000/api/v1/blogs?page=1&pageSize=5
    // const { page, pageSize }  = req.query;
    // const blogs = await blogsModel.findAndCountAll({
    //   order : [['bl_id','desc']],
    //   offset : (Number(page) -1) * (Number(pageSize)),
    //   limit : Number(pageSize)
    // }, {
    //   include : [{ 
    //     model : usersModel,
    //     attributes : ['us_fullname','us_email'],
    //     as : 'tb_users'
    //   }]
    // })'
    const blogs = await blogsModel.findAll({
      include : [
        {
          model : usersModel,
          attributes : ['us_fullname','us_email'],
          as : 'userAt',
          //required : true // default = inner join
        }
      ]
    });
    return res.status(200).json({
      blogs : blogs
    })
  } catch (err) {
    next(err); //ใช้ในรูปแบบ middleware error สำหรับ แสดง error กลางที่เดียว
  }
}
