const express = require("express");
const asyncWrap = require("../utils/AsyncWrap.js");
const router = express.Router();
const { islogin, isOwner, validateListing } = require('../middleware.js');
const listingCallbacks = require("../controller/listing.js");


// Home and new post route
router.route("/")
  .get(asyncWrap(listingCallbacks.home))
  .post(islogin, validateListing, asyncWrap(listingCallbacks.newPost));

// New Route
router.get("/new", islogin, listingCallbacks.new);

// Show Route
router.get("/:id/show", asyncWrap(listingCallbacks.show));

// Edit Route
router.get("/:id/edit", islogin, isOwner, asyncWrap(listingCallbacks.edit));

// Update and Delete Routes
router.route("/:id")
  .patch(islogin, isOwner, validateListing, asyncWrap(listingCallbacks.update))
  .delete(islogin, isOwner, asyncWrap(listingCallbacks.destroy));

//search

router.get("/search", asyncWrap(listingCallbacks.search));

module.exports = router;