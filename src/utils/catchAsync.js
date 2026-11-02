// Handles sync handlers as well as promise-returning handlers.
module.exports = fn => (req,res,next) => {
  Promise.resolve().then(() => fn(req,res,next)).catch(next);
};
