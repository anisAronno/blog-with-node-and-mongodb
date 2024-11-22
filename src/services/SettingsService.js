const Settings = require('../models/Settings');

class SettingsService {
  getBaseQuery(queryParams = {}) {
    const {
      page,
      limit,
      search,
      title: key,
      description: value,
      sort = 'createdAt',
    } = queryParams;

    return Settings.search(search, ['key', 'value'])
      .where('key', key)
      .where('value', value)
      .paginate(page, limit)
      .sort(sort);
  }

  async populateAuthor(response) {
    return Settings.model.populate(response, [
      {
        path: 'author',
        select: 'email name username',
      },
    ]);
  }

  async getAllSettings(queryParams = {}) {
    try {
      const response = await this.getBaseQuery(queryParams).execute();
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllPrivateSettings(queryParams = {}) {
    try {
      const response = await this.getBaseQuery(queryParams)
        .where('private', true)
        .execute();
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllPublicSettings(queryParams = {}) {
    try {
      const response = await this.getBaseQuery(queryParams)
        .where('private', false)
        .execute();
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createSetting(authorId, settingData) {
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

      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getSettingByKey(key) {
    try {
      const response = await Settings.getSettingsByKey(key);
      if (!response) throw new Error('Setting not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getPrivateSettingByKey(key) {
    try {
      const response = await Settings.getPrivateSettingsByKey(key);
      if (!response) throw new Error('Setting not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getPublicSettingByKey(key) {
    try {
      const response = await Settings.getPublicSettingsByKey(key);
      if (!response) throw new Error('Setting not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateSettingByKey(key, updateData) {
    try {
      const response = await Settings.updateSettingsByKey(key, updateData);
      if (!response) throw new Error('Setting not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteSettingByKey(key) {
    try {
      const response = await Settings.deleteSettingsByKey(key);
      if (!response) throw new Error('Setting not found');
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTrashedSettings(queryParams = {}) {
    try {
      const response = await this.getBaseQuery(queryParams)
        .onlyTrashed()
        .execute();
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async restoreSetting(key) {
    try {
      const response = await Settings.restoreByKey(key);
      if (!response) throw new Error('Setting not found');
      return this.populateAuthor(response);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async forceDeleteSetting(key) {
    try {
      const response = await Settings.forceDeleteByKey(key);
      if (!response) throw new Error('Setting not found');
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new SettingsService();
