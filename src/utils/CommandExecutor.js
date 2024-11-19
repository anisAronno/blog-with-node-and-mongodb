const { execFileSync } = require('child_process');
const Logger = require('./Logger');

class CommandExecutor {
  /**
   * Executes a system command synchronously
   * @param {Object} params Command parameters
   * @param {string} params.cmd Command to execute
   * @param {string[]} params.args Command arguments
   * @param {Object} params.options Execution options
   * @returns {string} Command output
   * @throws {Error} If command execution fails
   */
  static async run({ cmd, args, options }) {
    try {
      return execFileSync(cmd, args, options);
    } catch (error) {
      Logger.error('Command Execution Failed', error);
      throw error;
    }
  }
}

module.exports = CommandExecutor;
