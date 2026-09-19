import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './database/db.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

let server;

/**
 * Bootstrap sequence: Connect to database first, then start Express HTTP server.
 */
const startServer = async () => {
  // Connect to MongoDB Atlas
  await connectDB();
  
  // Start the server
  server = app.listen(PORT, () => {
    console.log(`🚀 MedAccess Backend Running on Port ${PORT}`);
  });
};

startServer();

/**
 * Graceful Shutdown Handlers
 * Real-world production servers must catch unexpected errors and shutdown gracefully.
 */
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection detected:');
  console.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:');
  console.error(err);
  process.exit(1);
});

