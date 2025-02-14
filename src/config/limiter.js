import rateLimit from 'express-rate-limit';

const limiterOptions = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.RATE_LIMIT || 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req, res) => process.env.NODE_ENV !== 'production',
});

export default limiterOptions;