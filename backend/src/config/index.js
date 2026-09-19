/**
 * Configuration Module Placeholder
 * 
 * Future Purpose:
 * - Load environment variables safely and provide type-safe fallback values.
 * - Group configurations by domain (e.g., app, database, jwt, cloudinary, googleMaps).
 * 
 * Future Integrations:
 * - Google Maps API keys for smart pharmacy calculations.
 * - Cloudinary keys for prescriptions storage.
 * - Nodemailer SMTP credentials for mailing operations.
 */

export const config = {
  app: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },
  // Future database settings
  database: {
    uri: process.env.MONGODB_URI || ''
  },
  // Future authentication settings
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  }
};

export default config;
