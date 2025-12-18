"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const parsed = schema.safeParse({ body: req.body, query: req.query, params: req.params });
    if (!parsed.success) {
        return res.status(400).json({ message: 'Validation error', errors: parsed.error.flatten() });
    }
    res.locals.validated = parsed.data;
    next();
};
exports.validate = validate;
