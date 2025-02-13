import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running smoothly!',
        timestamp: new Date().toISOString(),
    });
});

export default router;