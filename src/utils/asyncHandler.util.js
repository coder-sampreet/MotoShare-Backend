// src/utils/asyncHandler.util.js
/**
 * Wraps an async Express route to forward errors to the error handler.
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };
};
export default asyncHandler;
