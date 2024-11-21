const SettingsService = require('../services/SettingsService.js');

class SettingsController {
  static async getAll(req, res) {
    try {
      const settings = await SettingsService.getAllSettings(req.query);
      res.status(200).json({ settings });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPrivateOnly(req, res) {
    try {
      const settings = await SettingsService.getAllPrivateSettings(req.query);
      res.status(200).json({ settings });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPublicOnly(req, res) {
    try {
      const settings = await SettingsService.getAllPublicSettings(req.query);
      res.status(200).json({ settings });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async store(req, res) {
    try {
      const setting = await SettingsService.createSetting(
        req.body,
        req.user._id
      );
      res.status(201).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getByKey(req, res) {
    try {
      const setting = await SettingsService.getSettingByKey(req.params.key);
      res.status(200).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPrivateByKey(req, res) {
    try {
      const setting = await SettingsService.getPrivateSettingByKey(
        req.params.key
      );
      res.status(200).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getPublicByKey(req, res) {
    try {
      const setting = await SettingsService.getPublicSettingByKey(
        req.params.key
      );
      res.status(200).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateByKey(req, res) {
    try {
      const setting = await SettingsService.updateSettingByKey(
        req.params.key,
        req.body
      );
      res.status(200).json({ setting });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteByKey(req, res) {
    try {
      await SettingsService.deleteSettingByKey(req.params.key);
      res.status(200).json({ message: 'Setting deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = SettingsController;
