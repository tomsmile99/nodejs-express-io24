const qs = require('qs');
//const Database = require('../config/database');
const { Op } = require('sequelize');
const usersModel = require('../model/usersModel');
const blogsModel = require('../model/blogsModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const io = require('../realtime/socket-io');
const { getTotalUserService } = require('../services/userService');

exports.index = async (req, res, next) => {
  try {
    // await Database.authenticate();
    // console.log('Connecting mysql success...');

    /*
    const users = await usersModel.findAll({
      attributes : { exclude : ['us_password','us_permission'] }, // exclude = ระเว้นตัวที่เราไม่ต้องการให้แสดง
      // where: {
      //   us_permission : 'member'
      // },
      order : [['us_id','desc']]
    });
    if(users){
      return res.status(200).json({users})
    }
    */

    // แบบ SQL
    /*
    const sql = `select us_id, us_fullname, us_email from tb_users order by us_id desc`;
    const users = await Database.query(sql,{
      type : Database.QueryTypes.SELECT
    });
    return res.status(200).json({users})
    */

    // แบบ Pagination
    // http://127.0.0.1:4000/api/v1/users?page=1&pageSize=3

    const { page, pageSize }  = req.query;

    // const page = Number(page);
    // const pageSize = Number(pageSize) || 5;
    // const offset = (page - 1) * pageSize;

    const users = await usersModel.findAndCountAll({ // ดึงข้อมูลพร้อมนับจำนวนมาให้เลย
      attributes : { exclude : ['us_password','us_permission'] },
      order : [['us_id','desc']],
      offset : (Number(page) -1) * (Number(pageSize)),
      limit : Number(pageSize)
    }); 


    // find total Records
    //const totalRecord = await usersModel.count();

    return res.status(200).json({
      users: users,
      //totalPages: totalRecord
    })


  } catch (err) {
    // return res.status(500).json({
    //   message : `เกิดข้อผิดพลาด : ${err}`
    // })
    next(err); //ใช้ในรูปแบบ middleware error สำหรับ แสดง error กลางที่เดียว
  }
}

exports.showUser = async (req, res, next) => {
  try {
    const {id} = req.params;
    const users = await usersModel.findByPk(Number(id),{
      attributes : {exclude : ['us_password','us_permission']},
      include : [{ 
        model : blogsModel,
        as : 'blogAt',
        attributes : ['bl_id','bl_title','approve'] 
      }],
      order : [
        ['tb_blogs', 'bl_id', 'desc']
      ]

    });
    if(!users){
      const err = new Error('ไม่พบ User นี้ในระบบ');
      err.statusCode = 404;
      throw err;
    }
    return res.status(200).json({users})
  } catch (err) {
    next(err);
  }
  
  return res.status(200).json({
    message: `Hello, UserID : ${id} | CodeForm : ${codeform}`,
    status: 200,
    data: [
      { "ID" : id },
      { "CodeForm" : codeform }
    ] // replace with your data
  })
}

exports.searchUser = async (req, res, next) => {
  try{
    const { us_fullname_form, us_email_form, us_permission_form } = qs.parse(req.query)
    const users = await usersModel.findAll({
      attributes : { exclude : ['us_password','us_permission'] }, // exclude = ระเว้นตัวที่เราไม่ต้องการให้แสดง
      where: {
        // us_fullname : { [Op.like] : `%${us_fullname_form}%` }
        [Op.or] : [
          { us_fullname   : { [Op.like] : `%${us_fullname_form}%` } },
          { us_email      : { [Op.like] : `%${us_email_form}%` } },
          { us_permission : { [Op.like] : `%${us_permission_form}%` } }
        ]
      },
      order : [['us_id','desc']]
    });
    if(users.length === 0){
      const err = new Error('ไม่พบ User นี้ในระบบ');
      err.statusCode = 404;
      throw err;
    }
    return res.status(200).json({users})
  }catch(err){
    next(err);
  }
}


exports.registerUser = async (req, res, next) => {
  try {
    //validation
    const validation = validationResult(req)
    if(!validation.isEmpty()){
      const err = new Error('ท่านส่งข้อมูลไม่ถูกต้อง');
      err.statusCode = 401;
      err.validation = validation.array();
      throw err;
    }

    //How to insert to database
    const {us_fullname_form, us_email_form, us_password_form, us_permission_form} = req.body;

    //check email ซ้ำ
    const checkEmailUser = await usersModel.findOne({ where : {us_email : us_email_form}});
    if(checkEmailUser){
      const err = new Error('มีอีเมล์นี้ในระบบแล้ว โปรดใช้อีเมล์อื่น');
      err.statusCode = 422;
      throw err;
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(us_password_form, salt);
    
    const us_permission_form_fm = us_permission_form ? 'admin' : 'member' 
    //insert to database
    const userInsert = await usersModel.create({
      us_fullname     : us_fullname_form,
      us_email        : us_email_form,
      us_password     : hashedPassword,
      us_permission   : us_permission_form_fm
    });

    // ส่งข้อมูลจำนวนผู้ใช้ real-time ไปยัง front-end
    const countUser = await getTotalUserService();
    io.emit('total:User', countUser)

    if(userInsert){
      return res.status(201).json({
        message: `ท่านลงทะเบียนสำเร็จ`,
        status: 201,
        // data: [
        //   { "Register UserFullname" : fullname},
        //   { "Register Permission" : permission}
        // ] // replace with your data
      })
    }
  } catch (err) {
    next(err);
  }
}

exports.register2User = (req, res, next) => {
  const {fullname,permission} = req.body;
  return res.status(201).json({
    message: `Register Form-Data, UserFullname : ${fullname} | Permission : ${permission}`,
    status: 201,
    data: [
      { "Register UserFullname" : fullname},
      { "Register Permission" : permission}
    ] // replace with your data
  })
}

exports.loginUser = async (req, res, next) => {
  try {
    //validation
    const validation = validationResult(req)
    if(!validation.isEmpty()){
      const err = new Error('ไม่พบข้อมูล');
      err.statusCode = 401;
      err.validation = validation.array();
      throw err;
    }

    const {us_email_form, us_password_form} = req.body;

    //check email 
    const checkEmailUser = await usersModel.findOne({ where : {us_email : us_email_form}});
    if(!checkEmailUser){
      const err = new Error('Email ไม่ถูกต้อง');
      err.statusCode = 401;
      throw err;
    }
    //check Password 
    const isValid = await bcrypt.compare(us_password_form, checkEmailUser.us_password)
    if(!isValid){
      const err = new Error('Password ไม่ถูกต้อง');
      err.statusCode = 401;
      throw err;
    }

    //สร้าง jwt token
    const token = jwt.sign(
      { 
        user_id : checkEmailUser.us_id,
        user_permission : checkEmailUser.us_permission
      }, 
      process.env.JWT_KEY, 
      { 
        //expiresIn: '60' // 1 นาที
        expiresIn: '1h' // 1 ชม.
      }
    );
    return res.status(200).json({
      status: 200,
      message: `เข้าสู่ระบบสำเร็จ`,
      access_token : token
    })
  } catch (err) {
    next(err);
  }
}

exports.updateUser = async (req, res, next) => {
  try{
    const { id } = req.params;
    const users = await usersModel.findByPk(Number(id));
    if(!users){
      const err = new Error('ไม่พบ User นี้ในระบบ');
      err.statusCode = 404;
      throw err;
    }
    const { us_fullname_form, us_email_form } = req.body;
    await usersModel.update({
      us_fullname : us_fullname_form,
      us_email : us_email_form
    }, {
      where : {
        us_id : id
      }
    });
    return res.status(200).json({
      message: `อัปเดตข้อมูลสำเร็จ`,
      status: 200
    });
  }catch (err){
    next(err);
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDelete = await usersModel.destroy({
      where : {
        us_id : id
      }
    });
    if(userDelete === 0){
      const err = new Error('ไม่พบ User นี้ในระบบ');
      err.statusCode = 404;
      throw err;
    }
    return res.status(200).json({
      message: `ท่านลบผู้ใช้เรียบร้อย`,
      status: 200
    })
  }catch (err){
    next(err);
  }
}


// get user profile (ต้อง login และมี token ก่อน)
exports.userProfile = (req, res, next) => {
  return res.status(200).json(req.user)
}