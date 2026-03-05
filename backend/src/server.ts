import { buildApp } from './app';
import logger from './utils/logger';
import dotenv from 'dotenv';
// import { PrismaClient } from '@prisma/client';

dotenv.config();

const port = process.env.PORT || 5000;
const app = buildApp();
// export const prisma = new PrismaClient();

const startServer = async () => {
    try {
        // await prisma.$connect();
        // logger.info('Database connected successfully');

        app.listen(port, () => {
            logger.info(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
        });
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (err: any) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});
