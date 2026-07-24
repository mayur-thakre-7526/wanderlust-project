const express = require("express");
const router = express.Router();
const wrapAsnc = require("../utils/wrapAsnc.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // automatic creates uploads folder

// Show All Listings or Index route
// Create Route or post request for add a new listing
router
  .route("/")
  .get(wrapAsnc(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsnc(listingController.createListing),
  );

// new route or Add new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show perticuler id info or Show Route
// Update Route OR SAVE Changes in DB
// Delete Route
router
  .route("/:id")
  .get(wrapAsnc(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsnc(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsnc(listingController.destroyListing));

// Edit Route OR Edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsnc(listingController.renderEditForm),
);

module.exports = router;
