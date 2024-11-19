const Shop = require('../models/Shop');
const TenantService = require('../services/TenantService');
const { connectCentralDB } = require('../config/database');
const slugify = require('slugify');

class ShopController {
  static async createShop(req, res) {
    const centralDb = await connectCentralDB();
    const session = await centralDb.startSession();
    
    try {
      await session.withTransaction(async () => {
        const { name } = req.body;
        const userId = req.user.id; // Assuming user is authenticated

        // Generate subdomain from shop name
        const baseSubdomain = slugify(name, { lower: true, strict: true });
        let subdomain = baseSubdomain;
        let counter = 1;

        // Check subdomain availability
        while (await Shop.findBySubdomain(centralDb, subdomain)) {
          subdomain = `${baseSubdomain}${counter}`;
          counter++;
        }

        // Create shop record
        const shop = await Shop.create(centralDb, {
          name,
          subdomain,
          database: `shop_${subdomain}`,
          ownerId: userId
        });

        // Initialize tenant database with required collections
        await TenantService.initializeTenantDatabase(shop.database);

        // Add shop to user's shops array
        await centralDb.model('User').findByIdAndUpdate(
          userId,
          { $push: { shops: shop._id } }
        );

        res.status(201).json({
          success: true,
          shop: {
            id: shop._id,
            name: shop.name,
            subdomain: shop.subdomain,
            url: `https://${shop.subdomain}.yourdomain.com`
          }
        });
      });
    } catch (error) {
      console.error('Shop creation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create shop' 
      });
    } finally {
      session.endSession();
    }
  }

  static async getMyShops(req, res) {    
    try {
      const centralDb = await connectCentralDB();
      const shops = await Shop.findByOwner(centralDb, req.user.id);
      res.json({ shops });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message ,
        stack: error.stack
      });
    }
  }
}

module.exports = ShopController;
