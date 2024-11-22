const Contact = require('../models/Contact');

class ContactService {
  getBaseQuery(queryParams = {}) {
    const {
      page,
      limit,
      search,
      name,
      email,
      phone,
      message,
      subject,
      sort = 'createdAt',
    } = queryParams;

    return Contact.search(search, [
      'name',
      'email',
      'phone',
      'message',
      'subject',
    ])
      .where('name', name)
      .where('email', email)
      .where('phone', phone)
      .where('message', message)
      .where('subject', subject)
      .paginate(page, limit)
      .sort(sort);
  }

  async getAllContacts(queryParams = {}) {
    try {
      return await this.getBaseQuery(queryParams).execute();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTrashedContacts(queryParams = {}) {
    try {
      return await this.getBaseQuery(queryParams).onlyTrashed().execute();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createContact(contactData) {
    try {
      return await Contact.create({
        ...contactData,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getContactById(id) {
    try {
      const contact = await Contact.findById(id);
      if (!contact) throw new Error('Contact not found');
      return contact;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateContact(id, updateData) {
    try {
      const contact = await Contact.updateById(id, updateData);
      if (!contact) throw new Error('Contact not found');
      return contact;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteContact(id) {
    try {
      const contact = await Contact.deleteById(id);
      if (!contact) throw new Error('Contact not found');
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async restoreContact(id) {
    try {
      const contact = await Contact.restoreById(id);
      if (!contact) throw new Error('Contact not found');
      return contact;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async forceDeleteContact(id) {
    try {
      const contact = await Contact.forceDelete(id);
      if (!contact) throw new Error('Contact not found');
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getContactsByEmail(email) {
    try {
      const contacts = await this.getBaseQuery({ email }).execute();
      return contacts;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getContactsByPhone(phone) {
    try {
      const contacts = await this.getBaseQuery({ phone }).execute();
      return contacts;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new ContactService();
