const passport = require('passport');
const usersModel = require('../model/usersModel');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    /*
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
    */
    //console.log(jwt_payload.user_id);
    try{
        const user = await usersModel.findByPk(Number(jwt_payload.user_id),{
            attributes : {exclude : ['us_password']}
          })
        if(user){
            return done(null, user); // ส่งต่อไปที่ route (req เวลาใช้ req.user เรียกใช้ได้อัตโนมัติ)
        }
    }catch(err){
        //console.error(err);
        done(err, false);
        //return done(err, false);
    }



}));


const isAuth = passport.authenticate('jwt', {session : false})
module.exports = isAuth;