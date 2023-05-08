const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');
const { copyFile } = require('node:fs');
const fs = require('fs');

function callback(err) {
    if (err) throw err;
    console.log('Complete copying.');
}

async function copyDir() {

    fs.rmdir(join(__dirname, 'files-copy'), () => {
        console.log('Complete removing');
    })

    setTimeout(async () => {

        const projectFolder = join(__dirname, 'files-copy');
        const dirCreation = await mkdir(projectFolder, { recursive: true });

        fs.readdir(join(__dirname, 'files'), { withFileTypes: true }, (err, files) => {
            if (err) console.log(err)

            try {
                for (const file of files) {
                    if (file.isFile) {
                        copyFile(join(__dirname, 'files', file.name), join(__dirname, 'files-copy', file.name), callback);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        })
    }, 0);

}

copyDir().catch(console.error);