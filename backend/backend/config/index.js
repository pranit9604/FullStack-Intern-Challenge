import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    NODE_ENV: process.env.NODE_ENV || 'development'
};

export default config;
