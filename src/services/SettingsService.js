const Settings = require('../models/Settings.js');

class SettingsService {
  static async getAllSettings(queryParams) {
    try {
      const response = await Settings.search(queryParams.search, [
        'key',
        'value',
      ])
        .where('key', queryParams.title)
        .where('value', queryParams.description)
        .paginate(queryParams.page, queryParams.limit)
        .sort('createdAt')
        .execute();

      return await Settings.model.populate(response, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllPrivateSettings(queryParams) {
    try {
      const response = await Settings.search(queryParams.search, [
        'key',
        'value',
      ])
        .where('private', true)
        .where('key', queryParams.title)
        .where('value', queryParams.description)
        .paginate(queryParams.page, queryParams.limit)
        .sort('createdAt')
        .execute();

      return await Settings.model.populate(response, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getAllPublicSettings(queryParams) {
    try {
      const response = await Settings.search(queryParams.search, [
        'key',
        'value',
      ])
        .where('private', false)
        .where('key', queryParams.title)
        .where('value', queryParams.description)
        .paginate(queryParams.page, queryParams.limit)
        .sort('createdAt')
        .execute();

      return await Settings.model.populate(response, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async createSetting(settingData, authorId) {
    try {
      // Check if setting with same key already exists
      const existingSetting = await Settings.findOne({ key: settingData.key });
      if (existingSetting) {
        throw new Error('Setting with this key already exists');
      }

      const response = await Settings.create({
        ...settingData,
        author: authorId,
      });

      return await Settings.model.populate(response, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getSettingByKey(key) {
    try {
      const setting = await Settings.getSettingsByKey(key);
      if (!setting) {
        throw new Error('Setting not found');
      }

      return await Settings.model.populate(setting, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getPrivateSettingByKey(key) {
    try {
      const setting = await Settings.getPrivateSettingsByKey(key);
      if (!setting) {
        throw new Error('Setting not found');
      }

      return await Settings.model.populate(setting, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async getPublicSettingByKey(key) {
    try {
      const setting = await Settings.getPublicSettingsByKey(key);
      if (!setting) {
        throw new Error('Setting not found');
      }
      return await Settings.model.populate(setting, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async updateSettingByKey(key, updateData) {
    try {
      // Update the setting
      const setting = await Settings.updateSettingsByKey(key, updateData);

      if (!setting) {
        throw new Error('Setting not found');
      }

      return await Settings.model.populate(setting, [
        {
          path: 'author',
          select: 'email name username',
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async deleteSettingByKey(key) {
    try {
      const response = await Settings.deleteSettingsByKey(key);
      if (!response) {
        throw new Error('Setting not found');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = SettingsService;
