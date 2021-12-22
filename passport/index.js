const passport = require("passport");

const local = require("./localPolicy");
const kakao = require("./kakaoPolicy");
const naver = require("./naverPolicy"); //추가

const User = require("../models/user");

module.exports = () =>{
    passport.serializeUser((user,done)=>{ //사용자 정보를 세션에 아이디로 저장.
        done(null,user.id);
    });
    
    passport.deserializeUser((id,done)=>{   //세션의 저장한 아이디를 토대로 사용자 정보 객체를 불러옴.
       User.findOne({
           where:{ id },
           include : [{ 
               model : User,
               attributes : ['id','nick'],
               as : 'Followers',
           },{
               model : User,
               attributes : ['id','nick'],
               as : 'Followings',
           }],
        })
        .then(user => done(null,user))
        .catch(err => done(err));
    });
    
    
    local();
    kakao();
    naver();
    
};