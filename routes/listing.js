const express = require("express");
const router = express.Router();
const wrapAsnc = require("../utils/wrapAsnc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// Show All Listings or Index route
router.get("/", wrapAsnc(listingController.index));

// new route or Add new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show perticuler id info or Show Route
router.get("/:id", wrapAsnc(listingController.showListing));

// Create Route or post request for add a new listing
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsnc(listingController.createListing),
);

// Edit Route OR Edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsnc(listingController.renderEditForm),
);

// Update Route OR SAVE Changes in DB
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsnc(listingController.updateListing),
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsnc(listingController.destroyListing),
);

module.exports = router;
