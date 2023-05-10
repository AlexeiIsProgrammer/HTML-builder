const fs = require('fs');
const path = require('path');
const readdir = require('fs/promises');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
    if (err) console.log(err)

    try {
        // path.extname(file.name)
        for (const file of files) {
            if (file.isFile()) {
                fs.stat(path.join(__dirname, 'secret-folder', file.name), "utf8",
                    function (error, data) {
                        if (error) throw error;
                        console.log(`${file.name.split('.')[0]} - ${path.extname(file.name)} - ${(data.size / 1024).toFixed(3)}kb`);
                    });
            }
        }
    } catch (err) {
        console.error(err);
    }
})