const Tag = require('../models/Tag');

class TagController {
  // Get all tags
  async index(req, res) {
    try {
      const tags = await Tag.find();
      res.json({ success: true, data: tags });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Create new tag
  async store(req, res) {
    try {
      const { name } = req.body;
      const savedTag = await Tag.create({ name, author: req.user._id });
      res.status(201).json({ success: true, data: savedTag });
    } catch (error) {
      console.log(error.stack);

      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get single tag
  async show(req, res) {
    try {
      const tag = await Tag.findById(req.params.id);
      if (!tag) {
        return res
          .status(404)
          .json({ success: false, message: 'Tag not found' });
      }
      res.json({ success: true, data: tag });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update tag
  async update(req, res) {
    try {
      const { name } = req.body;
      const tag = await Tag.updateById(
        req.params.id,
        { name },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!tag) {
        return res
          .status(404)
          .json({ success: false, message: 'Tag not found' });
      }
      res.json({ success: true, data: tag });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Delete tag
  async destroy(req, res) {
    try {
      const tag = await Tag.deleteById(req.params.id);
      if (!tag) {
        return res
          .status(404)
          .json({ success: false, message: 'Tag not found' });
      }
      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TagController();
