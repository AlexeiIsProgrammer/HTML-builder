const fs = require('fs');
const path = require('path');
const { mkdir } = require('node:fs/promises');
const { copyFile } = require('node:fs');

const readableHTMLStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8')
// Считывание инфы из .html файла и замена одноименных тегов файлами
let htmlData = ''

createFolder()

readableHTMLStream.on('data', (chunk) => {
    htmlData = `${htmlData}${chunk}`
})

readableHTMLStream.on('end', () => {
    fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true }, (err, files) => {
        if (err) console.log(err)

        try {
            for (const file of files) {
                if (file.isFile) {
                    const nameOfElement = file.name.split('.')[0]
                    const readableStream = fs.createReadStream(path.join(__dirname, 'components', file.name), 'utf-8')

                    let data = ''

                    readableStream.on('data', (chunk) => {
                        data = `${data}${chunk}`
                    }).on('end', () => {
                        htmlData = htmlData.replace(`{{${nameOfElement}}}`, data)

                        const createFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8')
                        createFile.write(htmlData)

                    })
                }
            }

            // Перенос стилей

            fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
                if (err) console.log(err)

                const createFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8')
                for (const file of files) {
                    if (file.isFile && path.extname(file.name) === '.css') {

                        const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8')
                        readableStream.on('data', (chunk) => {

                            createFile.write(chunk)
                        })
                    }
                }
            })

            // Копирование папки

            copyAssets('assets')

        } catch (err) {
            console.error(err);
        }
    })
})

function createFolder() {
    fs.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true }, async () => {
        console.log('Complete project-dist\'s reloading!');

        const projectFolder = path.join(__dirname, 'project-dist');
        const dirCreation = await mkdir(projectFolder, { recursive: true });
    })

}

function copyAssets(pathStructor) {

    fs.rm(path.join(__dirname, 'project-dist', pathStructor), { recursive: true, force: true }, async () => {
        const projectFolder = path.join(__dirname, 'project-dist', pathStructor);
        const dirCreation = await mkdir(projectFolder, { recursive: true });

        fs.readdir(path.join(__dirname, pathStructor), { withFileTypes: true }, (err, files) => {
            if (err) console.log(err)

            try {
                for (const file of files) {
                    if (file.name.indexOf('.') === -1) {
                        copyAssets(path.join(pathStructor, file.name))
                    } else {
                        copyFile(path.join(__dirname, pathStructor, file.name), path.join(__dirname, 'project-dist', pathStructor, file.name), () => { });
                    }
                }
            } catch (err) {
                console.error(err);
            }
        })
    })
}