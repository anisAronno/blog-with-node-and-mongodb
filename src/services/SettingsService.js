
const Settings = require('../models/Settings');

class SettingsService {
  /**
   * Get base query with common conditions
   */
  getBaseQuery(queryParams = {}) {
    const {
      search,
      key,
      value,
      sort = 'createdAt',
    } = queryParams;

    return Settings
      .search(search, ['key', 'value'])
      .where('key', key)
      .where('value', value)
      .sort(sort);
  }

  /**
   * Private method to populate author relations
   */
  async _populateAuthor(data) {
    return Settings.with(['author name,email,username']).findById(data._id);
  }

  /**
   * Get all settings with pagination
   */
  async getAllSettings(queryParams = {}) {
    try {
      const response = await this.getBaseQuery(queryParams)
        .paginate(queryParams.page, queryParams.limit);
      return this._populateAuthor(response);
    } catch (error) {
      throw new Error(`Failed to get settings: ${error.message}`);
    }
  }

  /**
   * Get all private settings with pagination
   */
  async getAllPrivateSettings(queryParams = {}) {
    try {
      const response = await this.getBaseQuery(queryParams)
        .where('private', true)
        .paginate(queryParams.page, queryParams.limit);
      return this._populateAuthor(response);
    } catch (error) {
      throw new Error(`Failed to get private settings: ${error.message}`);
    }
  }

  /**
   * Get all public settings with pagination
   */
  async getAllPublicSettings(queryParams = {}) {
    try {
      const response = await this.getBaseQuery(queryParams)
        .where('private', false)
        .paginate(queryParams.page, queryParams.limit);
      return this._populateAuthor(response);
    } catch (error) {
      throw new Error(`Failed to get public settings: ${error.message}`);
    }
  }

  /**
   * Create new setting
   */
  async createSetting(authorId, settingData) {
    try {
      // Check if setting with same key exists
      const existing = await Settings.findOne({ key: settingData.key });
      if (existing) throw new Error('Setting with this key already exists');

      const setting = await Settings.create({
        ...settingData,
        author: authorId,
      });

      return this._populateAuthor(setting);
    } catch (error) {
      throw new Error(`Failed to create setting: ${error.message}`);
    }
  }

  /**
   * Get setting by key
   */
  async getSettingByKey(key) {
    try {
      const setting = await Settings.findOne({ key });
      if (!setting) throw new Error('Setting not found');
      return this._populateAuthor(setting);
    } catch (error) {
      throw new Error(`Failed to get setting: ${error.message}`);
    }
  }

  /**
   * Get private setting by key
   */
  async getPrivateSettingByKey(key) {
    try {
      const setting = await Settings.findOne({ key, private: true });
      if (!setting) throw new Error('Setting not found');
      return this._populateAuthor(setting);
    } catch (error) {
      throw new Error(`Failed to get private setting: ${error.message}`);
    }
  }

  /**
   * Get public setting by key
   */
  async getPublicSettingByKey(key) {
    try {
      const setting = await Settings.findOne({ key, private: false });
      if (!setting) throw new Error('Setting not found');
      return this._populateAuthor(setting);
    } catch (error) {
      throw new Error(`Failed to get public setting: ${error.message}`);
    }
  }

  /**
   * Update setting by key
   */
  async updateSettingByKey(key, updateData) {
    try {
      const setting = await Settings.findOneAndUpdate(
        { key },
        updateData,
        { new: true }
      );
      if (!setting) throw new Error('Setting not found');
      return this._populateAuthor(setting);
    } catch (error) {
      throw new Error(`Failed to update setting: ${error.message}`);
    }
  }

  /**
   * Delete setting by key
   */
  async deleteSettingByKey(key) {
    try {
      const setting = await Settings.findOneAndDelete({ key });
      if (!setting) throw new Error('Setting not found');
      return true;
    } catch (error) {
      throw new Error(`Failed to delete setting: ${error.message}`);
    }
  }

  /**
   * Get soft deleted settings
   */
  async getTrashedSettings(queryParams = {}) {
    try {
      const response = await this.getBaseQuery(queryParams)
        .onlyTrashed()
        .paginate(queryParams.page, queryParams.limit);
      return this._populateAuthor(response);
    } catch (error) {
      throw new Error(`Failed to get trashed settings: ${error.message}`);
    }
  }

  /**
   * Restore soft deleted setting
   */
  async restoreSetting(key) {
    try {
      const setting = await Settings.restoreById(key);
      if (!setting) throw new Error('Setting not found');
      return this._populateAuthor(setting);
    } catch (error) {
      throw new Error(`Failed to restore setting: ${error.message}`);
    }
  }

  /**
   * Permanently delete setting
   */
  async forceDeleteSetting(key) {
    try {
      const setting = await Settings.forceDelete(key);
      if (!setting) throw new Error('Setting not found');
      return true;
    } catch (error) {
      throw new Error(`Failed to force delete setting: ${error.message}`);
    }
  }
}

module.exports = new SettingsService();