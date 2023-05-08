const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
    if (err) console.log(err)

    try {
        const createFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8')
        for (const file of files) {
            if (file.isFile && path.extname(file.name) === '.css') {

                const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8')
                readableStream.on('data', (chunk) => {

                    createFile.write(chunk)
                })
            }
        }
    } catch (err) {
        console.error(err);
    }
})