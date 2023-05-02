const { stdin } = process

const fs = require('fs')

const createFile = fs.createWriteStream('./02-write-file/text.txt', 'utf-8')

stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit')
        process.exit()

    createFile.write(data)
})

let isCtrlC = false

process.on('exit', () => {
    if (isCtrlC)
        return

    console.log('Счастливого пути!');
})

process.on('SIGINT', function () {
    isCtrlC = true
    console.log('Счастливого пути!');
    process.exit()
});
