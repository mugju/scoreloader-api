const express = require('express');
const jwt = require('jsonwebtoken');

const {verifyToken} = require('./middlewares');

const {Domain, User, Post, Hashtag} = require('../models');

const router = express.Router();

router.post('/token', async (req, res)=>{
    const {clientSecret} = req.body;
    try{
        const domain = await Domain.findOne({
            where : {clientSecret},
            include : {     //user와 Domain 조인
                model : User,
                attribute : ['nick','id'],
            },
        });
        // 여기까진 돌아
        console.log(domain); // 쿼리결과 확인 문제가 있나 없나.. 쿼리는 잘 돌고.
        if (!domain){
            return res.status(401).json({
                code : 401,
                message : '등록되지 않은 도메인 입니다 등록하고 사용해주세요.',
            });
        }
        const token = jwt.sign({
            id : domain.User.id,
            nick : domain.User.nick,
        }, process.env.JWT_SECRET, {    //https://www.npmjs.com/package/jsonwebtoken
            expiresIn : "7d",
            issuer : 'admin',
        });
        console.log('이거 찍히면 정상적으로 도는겁니다.');
        console.log(token);
        return res.json({
            code : 200,
            message : '토큰이 정상적으로 발행되었습니다',
            token,
        });

    } catch(err){
        console.error(err); //이 코드 하나 안넣어서 개고생.. 이쪽은 고쳤고..
        return res.status(500).json({
            code : 500,
            message : 'Server Error'
        });
    }
});

router.get('/test', verifyToken, (req,res) =>{
    res.json(req.decoded);
});

router.get('/posts/hashtag/:title', verifyToken, async (req,res)=>{
    const hash_result = await Hashtag.findOne({ where : {title : req.params.title}})
    try{
        if(!hash_result){
            return res.status(404).json({
                code : 404,
                message : "검색결과가 없습니다.",
            });
        }
        const post = await hash_result.getPosts(); //get  + 모델의 복수형?

        return res.status(200).json({       //restful 구성요소
            code : 200,
            payload : post, 
        });


    } catch(err){
        console.error(err);
        return res.status(503).json({
            code : 503,
            message : "Server Error",
        })

    }
})

module.exports = router;