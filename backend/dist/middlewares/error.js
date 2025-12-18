"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const payload = { status, message: err.message || 'Internal Server Error' };
    if (err.code === 'P2002')
        payload.message = 'Unique constraint failed';
    if (process.env.NODE_ENV !== 'production')
        payload.stack = err.stack;
    res.status(status).json(payload);
}
