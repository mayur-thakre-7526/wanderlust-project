const express = require("express");
const router = express.Router();
const wrapAsnc = require("../utils/wrapAsnc.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Show All Listings or Index route
router.get(
  "/",
  wrapAsnc(async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index", { allListings });
  }),
);

// new route or Add new listing
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// Show perticuler id info or Show Route
router.get(
  "/:id",
  wrapAsnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exists!");
      return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  }),
);

// Create Route or post request for add a new listing
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsnc(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  }),
);

// Edit Route OR Edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsnc(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing you requested for does not exists!");
      return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });
  }),
);

// Update Route OR SAVE Changes in DB
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsnc(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsnc(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }),
);

module.exports = router;
