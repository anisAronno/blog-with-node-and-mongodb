const Contact = require('../models/Contact');

class ContactService {
  /**
   * Get base query with common conditions
   */
  getBaseQuery(queryParams = {}) {
    const {
      search,
      name,
      email,
      phone,
      message,
      subject,
      status,
      sort = 'createdAt',
    } = queryParams;

    return Contact.search(search, ['name', 'email', 'phone', 'message', 'subject'])
      .where('name', name)
      .where('email', email)
      .where('phone', phone)
      .where('message', message)
      .where('subject', subject)
      .where('status', status)
      .sort(sort);
  }

  /**
   * Get all contacts with pagination
   */
  async getAllContacts(queryParams = {}) {
    try {
      return await this.getBaseQuery(queryParams).paginate(queryParams.page, queryParams.limit);
    } catch (error) {
      throw new Error(`Failed to get contacts: ${error.message}`);
    }
  }

  /**
   * Get soft deleted contacts
   */
  async getTrashedContacts(queryParams = {}) {
    try {
      return await this.getBaseQuery(queryParams)
        .onlyTrashed()
        .paginate(queryParams.page, queryParams.limit);
    } catch (error) {
      throw new Error(`Failed to get trashed contacts: ${error.message}`);
    }
  }

  /**
   * Create new contact
   */
  async createContact(contactData) {
    try {
      return await Contact.create(contactData);
    } catch (error) {
      throw new Error(`Failed to create contact: ${error.message}`);
    }
  }

  /**
   * Get contact by ID
   */
  async getContactById(id) {
    try {
      const contact = await Contact.findById(id);
      if (!contact) throw new Error('Contact not found');
      return contact;
    } catch (error) {
      throw new Error(`Failed to get contact: ${error.message}`);
    }
  }

  /**
   * Update contact by ID
   */
  async updateContact(id, updateData) {
    try {
      const contact = await Contact.updateById(id, updateData);
      if (!contact) throw new Error('Contact not found');
      return contact;
    } catch (error) {
      throw new Error(`Failed to update contact: ${error.message}`);
    }
  }

  /**
   * Delete contact by ID
   */
  async deleteContact(id) {
    try {
      const contact = await Contact.deleteById(id);
      if (!contact) throw new Error('Contact not found');
      return true;
    } catch (error) {
      throw new Error(`Failed to delete contact: ${error.message}`);
    }
  }

  /**
   * Restore soft deleted contact
   */
  async restoreContact(id) {
    try {
      const contact = await Contact.restoreById(id);
      if (!contact) throw new Error('Contact not found');
      return contact;
    } catch (error) {
      throw new Error(`Failed to restore contact: ${error.message}`);
    }
  }

  /**
   * Permanently delete contact
   */
  async forceDeleteContact(id) {
    try {
      const contact = await Contact.forceDelete(id);
      if (!contact) throw new Error('Contact not found');
      return true;
    } catch (error) {
      throw new Error(`Failed to force delete contact: ${error.message}`);
    }
  }

  /**
   * Get contacts by email
   */
  async getContactsByEmail(email, queryParams = {}) {
    try {
      return await this.getBaseQuery({ ...queryParams, email }).paginate(
        queryParams.page,
        queryParams.limit
      );
    } catch (error) {
      throw new Error(`Failed to get contacts by email: ${error.message}`);
    }
  }

  /**
   * Get contacts by phone
   */
  async getContactsByPhone(phone, queryParams = {}) {
    try {
      return await this.getBaseQuery({ ...queryParams, phone }).paginate(
        queryParams.page,
        queryParams.limit
      );
    } catch (error) {
      throw new Error(`Failed to get contacts by phone: ${error.message}`);
    }
  }
}

module.exports = new ContactService();
