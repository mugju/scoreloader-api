const express = require('express');

const axios = require('axios');

const router = express.Router();

router.get('/test',async (req,res,next)=>{
    //토큰 발급받는 로직 구현..


    try{
        if(!req.session.jwt){ //없는 경우 발급받는 로직.
            const jwtToken = axios.post('http://localhost:9001/api_v1/token',{
                clientsecret : process.env.CLIENTSECRET
            });
            console.log(jwtToken.data); //키값좀 확인해보자
            if (jwtToken.data){ //토큰 발급성공임.
                req.session.jwt = jwtToken.data.token;
            }
            else{
                return res.json(jwtToken);
            }
        }
        // exports.verifyToken = (req,res,next)=>{
        //     try{
        //       req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
          
        const tokenTest = axios.get('http://localhost:9001/api_v1/test',{
            headers:{
                authorization : req.session.jwt //위의 주석코드 때문
            }
        });
        return res.json(tokenTest.data);
    }
    catch(err){
        console.error(err);
        return next(err);

    }
});

module.exports = router;