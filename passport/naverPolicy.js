//네이버 패스포트
const passport = require("passport");

const naverPoilcy = require("passport-naver").Strategy;

const User = require("../models/user");

module.exports = () =>{
    passport.use(new naverPoilcy({
        clientID : process.env.NAVER_ID,
        clientSecret : process.env.NAVER_SECRET,
        callbackURL: '/auth/naver/callback',
    }, async (accessToken, refreshToken, profile,done) =>{
        console.log("naver profile", profile);
        try{
            const exUser = await User.findOne({
                where: {snsId : profile.id, provider : 'naver'},
            });
            if (exUser){
                done(null, exUser);
            } else{
                const newUser = await User.create({
                    email: profile.emails[0].value,
                    nick : profile.displayName,
                    snsId :profile.id,
                    provider : 'naver',
                });
                done(null, newUser);
            }

        }catch(error){
            console.error(error);
            done(error);

        }
    }
    ));
}

