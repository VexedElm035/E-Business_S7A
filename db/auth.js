const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return next();
    }
    res.redirect("/customers/login");
  };
  
  const forwardAuthenticated = (req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    res.redirect("/");
  };
  
  module.exports = { ensureAuthenticated, forwardAuthenticated };
  