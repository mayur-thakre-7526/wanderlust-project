const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsnc = require("../utils/wrapAsnc.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Review Post Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsnc(reviewController.createReview),
);

// Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsnc(reviewController.destroyReview),
);

module.exports = router;
