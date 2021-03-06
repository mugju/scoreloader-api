const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const morgan = require("morgan");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");


dotenv.config();




const authRouter = require("./routes/auth");
const indexRouter = require("./routes");
const {sequelize} = require("./models");
const passportConfig = require('./passport');
//api 토큰 발급
const v1 = require('./routes/api_v1');

const app = express();
passportConfig();

app.set('port',process.env.PORT || 9001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express : app,
    watch : true,
});

sequelize.sync()
    .then(() =>{
        console.log("DB 연결함.")
    })
    .catch((err) =>{
        console.log(err);
    }
    );

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie : {
        httpOnly : true,
        secure : false,
    },
}));


app.use(passport.initialize());

app.use(passport.session());

app.use('/auth',authRouter);
app.use('/',indexRouter);

app.use('/v1',v1);

app.use((req,res,next) =>{
    const error  = new Error(`${req.method} ${req.url}`);
    error.status = 404;
    next(error);
});

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});


app.listen(app.get('port'), ()=>{
    console.log(app.get('port'),'번 포트 오픈');
});





