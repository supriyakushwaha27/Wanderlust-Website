const User=require("../models/user");

module.exports.signupForm=(req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signUp=async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.loginForm=(req, res) => {
    res.render("user/login.ejs");
}

module.exports.login=(req, res) => {
    req.flash("success", "Welcome back to wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have logged out successfully!");
        res.redirect("/listings");
    });
}