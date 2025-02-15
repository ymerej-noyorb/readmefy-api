import logger from "../config/winston.js";

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    logger.error(err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
  };
  
  export default errorHandler;
  