const express = require("express");
const asyncWrap = require("../utils/AsyncWrap.js");
const router = express.Router({ mergeParams: true });
const { validateReviews, islogin,isAuthor } = require("../middleware.js");

const reviewCallbacks=require("../controller/review.js");


//Review Page

router.post("/",islogin, validateReviews, asyncWrap(reviewCallbacks.create));


//delete review

router.delete("/:reviewId",islogin,isAuthor,asyncWrap(reviewCallbacks.destroy));


module.exports = router;