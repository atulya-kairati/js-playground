const fs = require('fs/promises');

const commands = {
    CREATE_FILE: 'create a file', // create a file <path>
    DELETE_FILE: 'delete file', // delete file <path>
    RENAME_FILE: 'rename file', // rename file <old path> to <new path>
    ADD_TO_FILE: 'append to', // append to <path> <content>
};


// this where the program starts
(async () => {
    // watch the command file
    const watcher = fs.watch('./command.txt');

    // open the command file
    const commandFileHandler = await fs.open('./command.txt', 'r');

    // register a function to an event on the commandFileHandler
    commandFileHandler.on('change', commandReader);

    // async iterator
    for await (let event of watcher) {
        if (event.eventType !== "change") continue;

        // emit change event and pass the handler
        commandFileHandler.emit('change', commandFileHandler);
    }
})();

/**
 * @param {fs.FileHandle} fileHandler 
 * @returns {undefined}
 */
async function commandReader(fileHandler) {
    // read the command file
    // getting file size in bytes
    const fileSize = (await fileHandler.stat()).size;

    // don't read empty file
    if (fileSize === 0) return;

    // allocating a buffer of size = fileSize
    const buffer = Buffer.alloc(fileSize);

    // offset is where to start writing data in the buffer
    const offset = 0; // 0 -> start of the buffer

    // length is the amount of bytes we want to read from the file
    const length = fileSize; // read the whole file

    // The location where to begin reading data from the file
    const position = 0; // from the start

    await fileHandler.read(
        buffer,
        offset,
        length,
        position
    );
    const fileContent = buffer.toString('utf-8');
    commandExecutor(fileContent);
}

/**
 * @param {string} command
 * @returns {undefined}
 */
function commandExecutor(command) {

    const commander = new Commander();

    // file creation
    if (command.includes(commands.CREATE_FILE)) {
        // extract path and pass it to createFile method of commander
        const path = command.substring(commands.CREATE_FILE.length).trim();
        commander.createFile(path);

        return;
    }

    // file deletion
    if (command.includes(commands.DELETE_FILE)) {
        // extract path and pass it to createFile method of commander
        const path = command.substring(commands.DELETE_FILE.length).trim();
        commander.deleteFile(path);

        return;
    }

    // renaming file
    if (command.includes(commands.RENAME_FILE)) {
        // extract path and pass it to createFile method of commander
        const [oldPath, newPath] = command.substring(commands.RENAME_FILE.length).trim().split(' to ');
        commander.renameFile(oldPath, newPath);

        return;
    }

    // appending to file
    if (command.includes(commands.ADD_TO_FILE)) {
        // extract path and pass it to createFile method of commander
        const [path, ...content] = command.substring(commands.ADD_TO_FILE.length).trimStart().split(' ');
        // Warn: getting content like this is not performant
        commander.appendToFile(path, content.join(' '));

        return;
    }

}

/**
 * Class contains all the methods corresponding to the commands
 */
class Commander {
    /**
     * Creates a file with given path
     * @param {String} path 
     */
    async createFile(path) {

        try {
            // opening file with w command will create file if it doesn't exist
            // wx -> Like 'w' but fails if the path exists.
            (await fs.open(path, 'wx')).close() // we close the  handle ASAP
        } catch (error) {
            console.log(`File already exists at ${path}`);
        }
    }


    /**
     * 
     * @param {String} path 
     */
    async deleteFile(path) {

        try {
            // unlink removes any symlinks and deletes files
            await fs.unlink(path)
        } catch (err) {
            console.log(`File not found at ${path}`);
        }
    }

    /**
     * @param {String} oldPath 
     * @param {String} newPath 
     */
    async renameFile(oldPath, newPath) {
        try {
            await fs.rename(oldPath, newPath)
        } catch (error) {
            console.log(`No file found at ${oldPath}`);
        }
    }

    /**
     * @param {String} path 
     * @param {String} content 
     */
    async appendToFile(path, content) {
        try {
            // a -> Open file for appending. The file is created if it does not exist.
            const fileHandler = await fs.open(path, 'a')
            await fileHandler.appendFile(content)
            fileHandler.close()
        } catch (error) {
            console.log(`File doesn't exist ${path}`);
        }
    }
}
