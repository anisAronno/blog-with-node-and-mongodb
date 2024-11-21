const ContactService = require('../services/ContactService');

class ContactController {
  async index(req, res) {
    try {
      const contacts = await ContactService.getAllContacts(req.query);
      res.status(200).json({ contacts });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const contact = await ContactService.createContact(req.body);
      res.status(201).json({ contact });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const contact = await ContactService.getContactById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json({ contact });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const contact = await ContactService.updateContact(
        req.params.id,
        req.body
      );
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json({ contact });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      const contact = await ContactService.deleteContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async restore(req, res) {
    try {
      const contact = await ContactService.restoreContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json({ contact });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async forceDestroy(req, res) {
    try {
      const contact = await ContactService.forceDeleteContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      res.status(200).json({ message: 'Contact permanently deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async trashed(req, res) {
    try {
      const contacts = await ContactService.getTrashedContacts(req.query);
      res.status(200).json({ contacts });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ContactController();
