const Settings = require('../models/Settings.js');

class SettingsService {
  static async getAllSettings(queryParams) {
    try {
      return await Settings.search(queryParams.search, ['key', 'value'])
        .where('key', queryParams.title)
        .where('value', queryParams.description)
        .paginate(queryParams.page, queryParams.limit)
        .sort('createdAt')
        .execute();
    } catch (error) {
      throw new Error(`Error fetching settings: ${error.message}`);
    }
  }

  static async getAllPrivateSettings(queryParams) {
    try {
      return await Settings.search(queryParams.search, ['key', 'value'])
        .where('private', true)
        .where('key', queryParams.title)
        .where('value', queryParams.description)
        .paginate(queryParams.page, queryParams.limit)
        .sort('createdAt')
        .execute();
    } catch (error) {
      throw new Error(`Error fetching settings: ${error.message}`);
    }
  }

  static async getAllPublicSettings(queryParams) {
    try {
      return await Settings.search(queryParams.search, ['key', 'value'])
        .where('private', false)
        .where('key', queryParams.title)
        .where('value', queryParams.description)
        .paginate(queryParams.page, queryParams.limit)
        .sort('createdAt')
        .execute();
    } catch (error) {
      throw new Error(`Error fetching settings: ${error.message}`);
    }
  }

  static async createSetting(settingData, authorId) {
    try {
      // Check if setting with same key already exists
      const existingSetting = await Settings.findOne({ key: settingData.key });
      if (existingSetting) {
        throw new Error('Setting with this key already exists');
      }

      return Settings.create({
        ...settingData,
        author: authorId,
      });
    } catch (error) {
      throw new Error(`Error creating setting: ${error.message}`);
    }
  }

  static async getSettingByKey(key) {
    try {
      const setting = await Settings.getSettingsByKey(key);
      if (!setting) {
        throw new Error('Setting not found');
      }
      return setting;
    } catch (error) {
      throw new Error(`Error fetching setting: ${error.message}`);
    }
  }

  static async getPrivateSettingByKey(key) {
    try {
      const setting = await Settings.getPrivateSettingsByKey(key);
      if (!setting) {
        throw new Error('Setting not found');
      }
      return setting;
    } catch (error) {
      throw new Error(`Error fetching setting: ${error.message}`);
    }
  }

  static async getPublicSettingByKey(key) {
    try {
      const setting = await Settings.getPublicSettingsByKey(key);
      if (!setting) {
        throw new Error('Setting not found');
      }
      return setting;
    } catch (error) {
      throw new Error(`Error fetching setting: ${error.message}`);
    }
  }

  static async updateSettingByKey(key, updateData) {
    try {
      // Update the setting
      return await Settings.updateSettingsByKey(key, updateData);
    } catch (error) {
      throw new Error(`Error updating setting: ${error.message}`);
    }
  }

  static async deleteSettingByKey(key) {
    try {
      const result = await Settings.deleteSettingsByKey(key);
      if (!result) {
        throw new Error('Setting not found');
      }
      return result;
    } catch (error) {
      throw new Error(`Error deleting setting: ${error.message}`);
    }
  }
}

module.exports = SettingsService;
