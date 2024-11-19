class SendEmail {
    static async send({ email, subject, message }) {
        try {
            // Send mail with defined transport object
            const mailOptions = {
                from: this.from,
                to: email,
                subject: subject,
                text: message,
                html: message // You can keep both text and html versions of the message
            };

            return mailOptions;
        } catch (error) {
            throw new Error(`Error sending email: ${error.message}`);
        }
    }
}

module.exports = SendEmail;