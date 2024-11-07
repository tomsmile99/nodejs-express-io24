const { DataTypes } = require('sequelize');
const Database = require('../config/database');

const blogsModel = Database.define(
  'blogsModel',
  {
    // Model attributes are defined here
    bl_id       : { type: DataTypes.INTEGER, autoIncrement: true,  primaryKey: true },
    bl_title    : { 
      type: DataTypes.STRING(255), 
      allowNull: false,
      get() {
        return this.getDataValue('bl_title').toUpperCase();
      }
    },
    created_at  : { type: DataTypes.DATE },
    updated_at  : { type: DataTypes.DATE },
    bl_status   : { 
      type: DataTypes.BOOLEAN, 
      defaultValue: 0,
      // get() { // sequelize Getters
      //   return this.getDataValue('bl_status') === true ? 'อนุมัติ' : 'ไม่อนุมัติ';
      // }
    },
    approve : { // sequelize Virtuals
      type: DataTypes.VIRTUAL,
      get(){
        return this.bl_status ? 'อนุมัติ' : 'ไม่อนุมัติ';
      }
    },
    publicDate_at : { // sequelize Virtuals
      type: DataTypes.VIRTUAL,
      get(){
        return `${this.created_at.getDate()}/${this.created_at.getMonth()+1}/${this.created_at.getFullYear()+543}`;
      }
    },
    bl_us_id    : { type: DataTypes.INTEGER }
  },
  {
    // Other model options go here
    tableName   : 'tb_blogs',
    underscored : true, // กรณีตั้งชื่อฟิว์ มี _ (bl_id,bl_title)
    timestamps  : true, // กรณีมีระบุวันและเวลา ที่เพิ่มหรืออัปเดต ต้องเปิดเป็น true
    createdAt   : 'created_at', // ต้องแจ้งกรณีชื่อใน column จริงๆ ไม่ต้องกันกับ createdAt
    updatedAt   : 'updated_at' // ต้องแจ้งกรณีชื่อใน column จริงๆ ไม่ต้องกันกับ updatedAt
  },
);





module.exports = blogsModel;