const { connectTenantDB } = require('../config/database');
const mongoose = require('mongoose');

class TenantService {
  static async initializeTenantDatabase(database) {
    const connection = await connectTenantDB(database);
    
    // Define shop-specific schemas
    const productSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: String,
      price: { type: Number, required: true },
      stock: { type: Number, default: 0 },
      category: String,
      images: [String],
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now }
    });

    const orderSchema = new mongoose.Schema({
      orderNumber: { type: String, required: true },
      customer: {
        name: String,
        email: String,
        address: String
      },
      items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }],
      total: { type: Number, required: true },
      status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
      },
      createdAt: { type: Date, default: Date.now }
    });

    const customerSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      address: String,
      orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
      createdAt: { type: Date, default: Date.now }
    });

    // Initialize collections
    connection.model('Product', productSchema);
    connection.model('Order', orderSchema);
    connection.model('Customer', customerSchema);

    return connection;
  }
}

module.exports = TenantService;