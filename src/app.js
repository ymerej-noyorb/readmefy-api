import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';

import routes from './routes/index.js';
import setupSwagger from './config/swagger.js';
import errorHandler from './middlewares/error.middleware.js';
import limiter from './config/limiter.js';
import corsOptions from './config/cors.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loadMorgan = async () => {
    if (process.env.NODE_ENV === 'development') {
        const { default: morgan } = await import('morgan');
        app.use(morgan('dev'));
    }
};
await loadMorgan();

if (process.env.NODE_ENV === 'production') {
    app.use(limiter);
}

app.use('/api', routes);
setupSwagger(app);
app.use(errorHandler);

export default app;