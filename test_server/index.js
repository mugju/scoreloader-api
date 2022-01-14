const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const ejs = require('ejs');
const cookie_parser = require('cookie-parser');
const path = require('path');
const app = express();
const pageRouter = require('./pages');

// const nunjucks = require('nunjucks');


dotenv.config();
app.set('port' , 9999);     //test server port 9999
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');




app.use(morgan('dev'));
app.use(cookie_parser());


app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie:{
        httpOnly : true,
        secure : false,
    },
    maxAge : 60*60*1000,
    

}))

app.use('/', pageRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} Non Router.`);
    error.status(404);
    next(error);
});

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    
    res.render('error',{
        err_message : err.message,
        error_status : 'error? 몰루'
    });
    
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번에서 실행중임.');
});