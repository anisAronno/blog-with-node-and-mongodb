// middleware/tenant.js
const APP_CONFIG = require('../config');
const { connectCentralDB } = require('../config/database');
const Shop = require('../models/Shop');
const TenantService = require('../services/TenantService');

const getTenantIdentifier = (req) => {
    
  try {
    // 1. Try to get from request body
    if (req.body && req.body.subdomain) {
      return req.body.subdomain;
    }

    // 2. Try to get from origin header
    if (req.get('origin')) {
      const originHostname = new URL(req.get('origin')).hostname;
      // Skip if origin is localhost or IP address
      if (!originHostname.includes('localhost') && !originHostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        return originHostname.split('.')[0];
      }
    }

    // 4. Try to get from host header
    if (req.headers.host) {
      const hostname = req.headers.host.split(':')[0]; // Remove port if present
      // Skip if hostname is localhost or IP address
      if (!hostname.includes('localhost') && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        return hostname.split('.')[0];
      }
    }

    // 5. Try to get from custom header
    if (req.headers['x-tenant-id']) {
      return req.headers['x-tenant-id'];
    }

    return null;
  } catch (error) {
    console.error('Error extracting tenant identifier:', error);
    return null;
  }
};

const tenantMiddleware = async (req, res, next) => {
  try {
    // Skip tenant check for specific routes
    const skipTenantRoutes = ['/api/auth', '/api/register', '/health'];
    if (skipTenantRoutes.some(route => req.path.startsWith(route))) {
      return next();
    }

    const subdomain = getTenantIdentifier(req);
    console.log('subdomain:', req.body.subdomains);
    
    if (!subdomain) {
      return res.status(400).json({ 
        error: 'Shop identifier not found', 
        message: 'Please provide a valid shop identifier through subdomain, request body, or headers'
      });
    }

    // Connect to central DB and find shop
    const centralDb = await connectCentralDB();
    
    // Clean subdomain to prevent injection
    const cleanSubdomain = subdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
    
    const shop = await Shop.findBySubdomain(centralDb, cleanSubdomain);

    if (!shop) {
      return res.status(404).json({ 
        error: 'Shop not found',
        message: `No shop found with identifier: ${cleanSubdomain}`
      });
    }

    if (!shop.isActive) {
      return res.status(403).json({ 
        error: 'Shop is inactive',
        message: 'This shop is currently inactive. Please contact support for more information.'
      });
    }

    // Initialize or get existing tenant database connection
    const tenantDb = await TenantService.initializeTenantDatabase(shop.database);

    // Attach shop info and db connection to request
    req.shop = shop;
    req.tenantDb = tenantDb;

    // Add tenant context to response headers
    res.setHeader('X-Tenant-ID', shop.subdomain);

    // Add cleanup on response finish
    res.on('finish', () => {
      // Add any cleanup code here if needed
      // For example, logging request completion
      console.log(`Request completed for tenant: ${shop.subdomain}`);
    });

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    console.error(error.stack); // Log full stack trace
    
    res.status(500).json({ 
      error: 'Error processing shop request',
      message: APP_CONFIG.ENVIRONMENT === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = tenantMiddleware;