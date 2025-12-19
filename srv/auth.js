// Simple pass-through auth that does nothing
// This prevents CAP from trying to load JWT auth
module.exports = function() {
  return function(req, res, next) {
    // No authentication - just pass through
    next();
  };
};

