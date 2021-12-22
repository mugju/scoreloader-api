const express = require('express');

const { isLoggedIn} = require('./middlewares');

const User = require('../models/user');

const router = express.Router();

router.post('/id:/follow', isLoggedIn , async (req, res, next) => {
    try{
        const user = await User.findOne({ 
            where:{id : req.user.id}
        });
        if(user){
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('추가되었습니다');
        }else{
            res.status(404).send('no user found');
        }
    }catch(error){
        console.log(error);
        next(error);
    }
});

module.exports = router;