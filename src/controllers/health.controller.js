export const getHealth = (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Healthy',
        timestamp: new Date().toISOString(),
    });
};
