const { Server } = require("socket.io");
const { getTotalUserService } = require('../services/userService');

const io = new Server({
  cors : {
    origin : 'http://127.0.0.1:5173' // allow origin
    // methods : ["GET", "POST"]
  },
});

let constClient = 0;

io.on("connection", async (socket) => {
  constClient++;
  io.emit('welcome', `ยินดีตอนรับสู่ DashBoard`); // ส่
  console.log(`Client Online : ${constClient}`)

  // ส่งข้อมูลจำนวนผู้ใช้ real-time ไปยัง front-end
  const countUser = await getTotalUserService();
  io.emit('total:User', countUser)

  socket.on("disconnect", (reason) => {
    constClient--;
    console.log(reason)
    console.log(`Client Offline : ${constClient}`)
  });
});

module.exports = io;