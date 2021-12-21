const express = require("express");
const path = require("path");
const cookieParser = require("cookie-Parser");
const passport = require("passport");
const morgan = require("morgan");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");


dotenv.config();

const authRouter = require("./routes/auth");

