const TagService = require('../services/TagService');

class TagController {
  // Get all tags
  async index(req, res) {
    try {
      const tags = await TagService.getAllTags(req.query);
      res.json({ success: true, ...tags });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Create new tag
  async store(req, res) {
    try {
      const { name } = req.body;
      const savedTag = await TagService.create({ name, author: req.user._id });
      res.status(201).json({ success: true, tag: savedTag });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get single tag
  async show(req, res) {
    try {
      const tag = await TagService.getTagById(req.params.id);
      if (!tag) {
        return res
          .status(404)
          .json({ success: false, message: 'Tag not found' });
      }
      res.json({ success: true, tag: tag });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update tag
  async update(req, res) {
    try {
      const { name } = req.body;
      const tag = await TagService.updateTag(req.params.id, { name });
      if (!tag) {
        return res
          .status(404)
          .json({ success: false, message: 'Tag not found' });
      }

      res.json({ success: true, tag: tag });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Delete tag
  async destroy(req, res) {
    try {
      const tag = await TagService.deleteTag(req.params.id);

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

  // Get all blogs with tag
  async getBlogsByTag(req, res) {
    try {
      const blogs = await TagService.getBlogsByTagId(req.params.id, req.query);
      res.json({ success: true, ...blogs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TagController();
