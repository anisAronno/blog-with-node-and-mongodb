const Contact = require('../models/Contact');

class ContactService {
  // Create a new contact
  async createContact(data) {
    try {
      return await Contact.create(data);
    } catch (error) {
      throw new Error(`Contact creation failed: ${error.message}`);
    }
  }

  // Get all contacts with pagination
  async getAllContacts(queryParams = {}) {
    return Contact.search(queryParams.search, [
      'name',
      'email',
      'phone',
      'message',
      'subject',
    ])
      .where('name', queryParams.name)
      .where('email', queryParams.email)
      .where('phone', queryParams.phone)
      .where('message', queryParams.message)
      .where('subject', queryParams.subject)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }

  // Get contact by ID
  async getContactById(id) {
    try {
      const contact = await Contact.findById(id);
      if (!contact) {
        throw new Error('Contact not found');
      }
      return contact;
    } catch (error) {
      throw new Error(`Failed to fetch contact: ${error.message}`);
    }
  }

  // Update contact
  async updateContact(id, updateData) {
    try {
      const contact = await this.getContactById(id);
      if (!contact) {
        throw new Error('Contact not found');
      }

      Object.assign(contact, updateData);
      await contact.save();

      return contact;
    } catch (error) {
      throw new Error(`Contact update failed: ${error.message}`);
    }
  }

  // Delete contact
  async deleteContact(id) {
    try {
      return await Contact.deleteById(id);
    } catch (error) {
      throw new Error(`Contact deletion failed: ${error.message}`);
    }
  }

  // Restore contact
  async restoreContact(id) {
    try {
      return await Contact.restoreById(id);
    } catch (error) {
      throw new Error(`Contact restoration failed: ${error.message}`);
    }
  }

  // Force delete contact
  async forceDeleteContact(id) {
    try {
      return await Contact.forceDelete(id);
    } catch (error) {
      throw new Error(`Contact force deletion failed: ${error.message}`);
    }
  }

  // Get all trashed contacts
  async getTrashedContacts(queryParams = {}) {
    return Contact.search(queryParams.search, [
      'name',
      'email',
      'phone',
      'message',
      'subject',
    ])
      .where('deleted_at', { $ne: null })
      .where('name', queryParams.name)
      .where('email', queryParams.email)
      .where('phone', queryParams.phone)
      .where('message', queryParams.message)
      .where('subject', queryParams.subject)
      .paginate(queryParams.page, queryParams.limit)
      .sort('createdAt')
      .execute();
  }
}

module.exports = new ContactService();
