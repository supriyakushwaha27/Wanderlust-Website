const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const expressError = require("./utils/ExpressError.js");
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport =require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

const listingRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', engine);


main().then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const sessionOptions={
    secret: 'secretkey',
    saveUninitialized:true,
    resave: false,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);


// Home Route
app.get("/",(req, res, next) => {
    res.send("Welcome to our website");
});
    

app.all("*", (req, res) => {
    throw new expressError(404, "Page not found !");
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occured" } = err;
    res.status(status).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});


