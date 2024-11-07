const { DataTypes } = require('sequelize');
const Database = require('../config/database');
const blogsModel = require('./blogsModel');


const usersModel = Database.define(
  'usersModel',
  {
    // Model attributes are defined here
    us_id : { type: DataTypes.INTEGER, autoIncrement: true,  primaryKey: true },
    us_fullname : { type: DataTypes.STRING(255), allowNull: false },
    us_email : { type: DataTypes.STRING(255), allowNull: false, unique: true },
    us_password : { type: DataTypes.TEXT, allowNull: false },
    us_permission : { type: DataTypes.STRING(50), defaultValue: 'member' }
  },
  {
    // Other model options go here
    tableName : 'tb_users',
    underscored : true,
    timestamps : false
  },
);

usersModel.hasMany(blogsModel, {
  foreignKey : 'bl_us_id', // FK ของตาราง tb_blogs
  sourceKey : 'us_id', // PK ของตาราง tb_users
  as : 'blogAt' // สำหรับชื่ออ้างอิงไปใช้งานในส่วนต่างๆ
})


// Many to One
blogsModel.belongsTo(usersModel, {
  foreignKey : 'bl_us_id', // FK ของตาราง tb_blogs
  targetKey : 'us_id', // PK ของตาราง tb_users
  as : 'userAt' // สำหรับชื่ออ้างอิงไปใช้งานในส่วนต่างๆ
})


module.exports = usersModel;