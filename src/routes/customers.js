const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController.js");
const { ensureAuthenticated, forwardAuthenticated } = require("../../db/auth.js");

router.get("/signup", forwardAuthenticated, customerController.getSignup);
router.get("/login", forwardAuthenticated, customerController.getLogin);
router.post("/signup-user", customerController.addCustomer);
router.post("/login-user", customerController.authCustomer);

router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user });
});

router.get("/logout", ensureAuthenticated, customerController.logoutCustomer);

router.get("/complement-profile", (req, res) => {
  res.render("complement", { currentUser: req.session.user });
});
  
router.post("/complement-profile", customerController.complementProfile);
  
module.exports = router;