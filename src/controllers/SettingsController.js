const SettingsService = require('../services/SettingsService.js');

class SettingsController {
  static async getAllSettings(req, res) {
    try {
      const settings = await SettingsService.getAllSettings(req.query);
      res.status(200).json({ settings });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPrivateSettings(req, res) {
    try {
      const settings = await SettingsService.getAllPrivateSettings(req.query);
      console.log(settings);

      res.status(200).json({ settings });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPublicSettings(req, res) {
    try {
      const settings = await SettingsService.getAllPublicSettings(req.query);
      res.status(200).json({ settings });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async createSetting(req, res) {
    try {
      const setting = await SettingsService.createSetting(req.user._id, req.body);
      res.status(201).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getSettingByKey(req, res) {
    try {
      const setting = await SettingsService.getSettingByKey(req.params.key);
      res.status(200).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPrivateSettingByKey(req, res) {
    try {
      const setting = await SettingsService.getPrivateSettingByKey(req.params.key);
      res.status(200).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPublicSettingByKey(req, res) {
    try {
      const setting = await SettingsService.getPublicSettingByKey(req.params.key);
      res.status(200).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateSetting(req, res) {
    try {
      const setting = await SettingsService.updateSettingByKey(req.params.key, req.body);
      res.status(200).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteSetting(req, res) {
    try {
      await SettingsService.deleteSettingByKey(req.params.key);
      res.status(200).json({ message: 'Setting deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = SettingsController;
