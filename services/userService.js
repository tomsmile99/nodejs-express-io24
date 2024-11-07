const usersModel = require('../model/usersModel')


const getTotalUserService = async () => {
  return await usersModel.count();
}


const getUserByPermissionService = async (permission) => {
  const user = await usersModel.findAll({
    attributes : {exclude : ['us_password']},
    where: {
      us_permission : permission
    }
  })
  return user;
}

// async function getTotalUserService() {
//   return await usersModel.count();
// }

// async function getUserByPermissionService(permission) {
//   const user = await usersModel.findAll({
//       attributes: {exclude: ['password']},
//       where: {
//           permission: permission
//       }
//   });    
//   return user;
// }



module.exports = {
  getTotalUserService,
  getUserByPermissionService
}
