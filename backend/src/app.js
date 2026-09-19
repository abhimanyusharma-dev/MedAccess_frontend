import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Create Express application
const app = express();

/**
 * Global Middlewares Configuration
 */

// Secure the app by setting various HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing for frontend communication
app.use(cors());

// HTTP request logger middleware for development logging
app.use(morgan('dev'));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

/**
 * Future API Routes Integration Placeholder
 * 
 * In subsequent phases, API routes will be imported and mounted here:
 * 
 * import apiRoutes from './routes/index.js';
 * app.use('/api/v1', apiRoutes);
 */

/**
 * Future Error Handling Middleware Placeholder
 * 
 * In subsequent phases, central error handlers will be registered here:
 * 
 * import { errorHandler } from './middleware/errorHandler.js';
 * app.use(errorHandler);
 */

// Export the app instance for use in server.js
export default app;

import User from "./models/User.js";
import StoreOwner from "./models/StoreOwner.js";
import Admin from "./models/Admin.js";

console.log(User.modelName);
console.log(StoreOwner.modelName);
console.log(Admin.modelName);