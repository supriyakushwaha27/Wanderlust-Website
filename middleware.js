const List=require("./models/listing");
const Review=require("./models/reviews.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const expressError = require("./utils/ExpressError.js");


module.exports.islogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please login first");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveredirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    const listing=await List.findById(id);
    if(res.locals.currUser && !res.locals.currUser._id.equals(listing.owner._id)){
        req.flash("error", "You don't have permission!");
        return res.redirect(`/listings/${id}/show`);
    }
    next();
};


module.exports.isAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review=await Review.findById(reviewId);
    if(res.locals.currUser && !res.locals.currUser._id.equals(review.author._id)){
        req.flash("error", "You are not the author!");
        return res.redirect(`/listings/${id}/show`);
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map((v) => v.message).join(", ");
        throw new expressError(400, errorMsg);
    } else {
        next();
    }
};



module.exports.validateReviews = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map((v) => v.message).join(", ");
        throw new expressError(400, errorMsg);
    } else {
        next();
    }
};
