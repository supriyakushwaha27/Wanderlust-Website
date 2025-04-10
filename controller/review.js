const Review=require("../models/reviews");
const List = require("../models/listing.js");

module.exports.create=async (req, res, next) => {
    const { id } = req.params;
    const list = await List.findById(id);
    const review = new Review(req.body.review);
    review.author=req.user._id;
    list.reviews.push(review);
    await review.save();
    await list.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}/show`);
}


module.exports.destroy=async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await List.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}/show`);
}