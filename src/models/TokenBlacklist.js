const mongoose = require('mongoose');
const Model = require('./Model');

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Auto-remove expired tokens
    },
  },
  {
    timestamps: true,
  }
);

const TokenBlacklistModel = mongoose.model(
  'TokenBlacklist',
  tokenBlacklistSchema
);

class TokenBlacklist extends Model {
  constructor() {
    super(TokenBlacklistModel);
  }

  // Add token to blacklist
  async blacklistToken(token, expiresAt) {
    try {
      return await this.create({
        token,
        expiresAt,
      });
    } catch (error) {
      throw new Error(`Token blacklisting failed: ${error.message}`);
    }
  }

  // Check if token is blacklisted
  async isTokenBlacklisted(token) {
    try {
      const blacklistedToken = await this.findOne({ token });
      return !!blacklistedToken;
    } catch (error) {
      throw new Error(`Token blacklist check failed: ${error.message}`);
    }
  }
}

module.exports = new TokenBlacklist();
