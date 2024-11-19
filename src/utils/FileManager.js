const { promises: fsPromises } = require('fs');
const { existsSync, mkdirSync, rmSync, chmodSync } = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const Logger = require('./Logger');

/**
 * Manages file operations for project builds
 */
class FileManager {
    /** @private */ #context;

    /**
     * @param {string} context Logger context
     * @param {string} baseDir Base directory for projects
     */
    constructor(context = 'FileManager') {
        this.#context = context;
    }

    /**
     * Create new instance with specific context
     * @param {string} projectSlug Project identifier
     * @returns {FileManager} FileManager instance
     */
    static forProject(projectSlug) {
        return new FileManager(projectSlug);
    }

    /**
     * Create base project directory
     * @param {string} projectSlug Project identifier
     * @returns {string} Base path
     */
    createBasePathSync(projectSlug) {
        try {
            const basePath = path.join(BUILD_CONFIG.TEMP_DIR, projectSlug);
            this.#ensureDirectory(BUILD_CONFIG.TEMP_DIR);
            this.#ensureDirectory(basePath, true);
            return basePath;
        } catch (error) {
            throw new Error('Failed to create project directory');
        }
    }

    /**
     * @private
     */
    #ensureDirectory(dirPath, clean = false) {
        if (clean && existsSync(dirPath)) {
            rmSync(dirPath, { recursive: true });
        }
        
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true });
            chmodSync(dirPath, 0o755);
        }
    }

    /**
     * @param {string} sinkPath Path to zip file
     * @param {string} basePath Base directory path
     * @param {string} projectSlug Project identifier
     * @returns {Promise<string>} Extracted path
     */
    async unzipProject(sinkPath, basePath, projectSlug) {
        Logger.info(this.#context, `Starting unzip process for ${sinkPath}`);
        
        try {
            const stdout = execSync(`unzip -o ${sinkPath}`, {
                maxBuffer: BUILD_CONFIG.MAX_BUFFER_SIZE,
                cwd: basePath,
                encoding: BUILD_CONFIG.FILE_ENCODING
            });

            const pattern = /^.+\n.+\n.+:\s(.+)?\//g;
            const matches = pattern.exec(stdout);
            
            if (!matches?.[1]) {
                throw new Error('Invalid zip file structure');
            }

            const extractedPath = path.join(basePath, matches[1]);
            Logger.info(this.#context, `Successfully unzipped ${projectSlug} to ${extractedPath}`);
            
            return extractedPath;
        } catch (error) {
            Logger.error(this.#context, `Unzip failed: ${error.message}`);
            throw new Error('Failed to unzip project file');
        }
    }

    /**
     * @param {string} directory Directory containing the JSON file
     * @param {string} filename Name of the JSON file
     * @returns {Promise<Object>} Parsed JSON content
     */
    async parseJsonFile(directory, filename) {
        const filePath = path.join(directory, filename);
        
        if (!existsSync(filePath)) {
            Logger.info(this.#context, `${filename} not found in ${directory}`);
            return {};
        }

        try {
            const content = await fsPromises.readFile(filePath, BUILD_CONFIG.FILE_ENCODING);
            return JSON.parse(content);
        } catch (error) {
            Logger.error(this.#context, `Failed to parse ${filename}: ${error.message}`);
            throw new Error(`Invalid format of ${filename}`);
        }
    }

    /**
     * @param {string} currentPath Current directory path
     * @param {string} newName New directory name
     * @param {string} basePath Base directory path
     * @returns {Promise<string>} New path
     */
    async renameProjectFolder(currentPath, newName, basePath) {
        const newPath = path.join(basePath, newName);

        try {
            if (existsSync(newPath)) {
                await fsPromises.rm(newPath, { recursive: true });
            }
            await fsPromises.rename(currentPath, newPath);
            
            Logger.info(this.#context, `Renamed project folder to ${newPath}`);
            return newPath;
        } catch (error) {
            Logger.error(this.#context, `Folder rename failed: ${error.message}`);
            throw new Error('Failed to rename project folder');
        }
    }

    /**
     * @param {string} basePath Base directory path
     * @param {string} targetPath Target file/directory path
     */
    async removeFile(basePath, targetPath) {
        const fullPath = path.join(basePath, targetPath);
        
        try {
            const stats = await fsPromises.lstat(fullPath);
            
            if (stats.isDirectory()) {
                await fsPromises.rm(fullPath, { recursive: true });
                Logger.info(this.#context, `Removed directory: ${targetPath}`);
            } else {
                await fsPromises.unlink(fullPath);
                Logger.info(this.#context, `Removed file: ${targetPath}`);
            }
        } catch (error) {
            Logger.warn(this.#context, `Failed to remove ${targetPath}: ${error.message}`);
        }
    }

    /**
     * @param {string} projectPath Project directory path
     * @param {string} projectName Project name
     * @param {Object} requirement Project requirements
     * @returns {Promise<Object>} Zip file details
     */
    async createProjectZip(projectPath, projectName, requirement = {}) {
        const zipFileName = `${projectName}.zip`;
        const zipFilePath = path.join(path.dirname(projectPath), zipFileName);

        try {
            await this.#zipDirectory(projectPath, zipFilePath);
            Logger.info(this.#context, `Successfully created zip archive: ${zipFilePath}`);
            
            return {
                path: zipFilePath,
                requirement
            };
        } catch (error) {
            Logger.error(this.#context, `Zip creation failed: ${error.message}`);
            throw new Error('Failed to create project zip');
        }
    }

    /**
     * @private
     */
    async #zipDirectory(sourcePath, outputPath) {
        const sourceDir = path.basename(sourcePath);
        const parentDir = path.dirname(sourcePath);
        
        try {
            execSync(`cd "${parentDir}" && zip -r "${outputPath}" "${sourceDir}"`, {
                maxBuffer: BUILD_CONFIG.MAX_BUFFER_SIZE
            });
        } catch (error) {
            throw new Error(`Zip creation failed: ${error.message}`);
        }
    }

    /**
     * @param {string} filePath Path to file
     */
    async deleteFile(filePath) {
        try {
            await fsPromises.unlink(filePath);
            Logger.info(this.#context, `Deleted file: ${filePath}`);
        } catch (error) {
            Logger.warn(this.#context, `Failed to delete file ${filePath}: ${error.message}`);
        }
    }
}

module.exports = FileManager;
