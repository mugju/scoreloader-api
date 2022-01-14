const express = require('express');

const axios = require('axios');

const router = express.Router();

router.get('/test',async (req,res,next)=>{
    //토큰 발급받는 로직 구현..


    try{
        if(!req.session.jwt){ //없는 경우 발급받는 로직.
            console.log('api 서버에 접속중...'); //확인용 500error 문제있음.
            const jwtToken = await axios.post('http://localhost:9001/v1/token',{
                clientSecret : process.env.CLIENT_SECRET  //이거 스펠링 req.body에 들어갈거
            });
            // console.log(jwtToken);
            console.log('내용나올거임..',jwtToken.data); //키값좀 확인해보자 //키값이 안뜸.
            // res.send(jwtToken.data);
            if (jwtToken.data && jwtToken.data.code == 200){ //토큰 발급성공임.
                req.session.jwt = jwtToken.data.token;
            }
            else{
                console.log('뭔가 문제있음');
                
                return res.json(jwtToken.data);
            }
        }

        // console.log('이상한데..',req.session.jwt);
        // exports.verifyToken = (req,res,next)=>{
        //     try{
        //       req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
          
        const tokenTest = await axios.get('http://localhost:9001/v1/test',{
            headers:{
                authorization : req.session.jwt //위의 주석코드 때문
            }
        });
        // console.log(res.json(tokenTest.data));
        console.log('Test 완료');
        return res.json(tokenTest.data);
    }
    catch(err){
        console.error(err);
        return next(err);

    }
});

module.exports = router;