const TagService = require('../services/TagService');

class TagController {
  // Get all tags
  async index(req, res) {
    try {
      const tags = await TagService.getAllTags(req.query);
      res.json({ success: true, tags });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
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
      res.status(400).json({ success: false, message: error.message });
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

      res.json({ success: true, message: 'Tag deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Restore tag
  async restoreTag(req, res) {
    try {
      const tag = await TagService.restoreTag(req.params.id);

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

  // Force delete tag
  async forceDeleteTag(req, res) {
    try {
      const tag = await TagService.forceDeleteTag(req.params.id);

      if (!tag) {
        return res
          .status(404)
          .json({ success: false, message: 'Tag not found' });
      }

      res.json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get Trash tags
  async getTrashedTags(req, res) {
    try {
      const tags = await TagService.getTrashedTags(req.query);
      res.json({ success: true, tags });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Get Tag by Slug
  async getTagBySlug(req, res) {
    try {
      const tag = await TagService.getTagBySlug(req.params.slug);
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
}

module.exports = new TagController();
