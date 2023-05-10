const { mkdir } = require('node:fs/promises');
const path = require('path');
const { copyFile, rm } = require('node:fs');
const fs = require('fs');

function callback(err) {
    if (err) throw err;
}

function copyDir() {
    rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true }, async () => {
        console.log('Complete removing');

        const projectFolder = path.join(__dirname, 'files-copy');
        await mkdir(projectFolder, { recursive: true });

        fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
            if (err) console.log(err)

            try {
                for (const file of files) {
                    if (file.isFile()) {
                        copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), callback);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        })

    })
}

copyDir();