const fs = require('fs');
const readableStream = fs.createReadStream('./01-read-file/text.txt', 'utf-8')

let data = ''

readableStream.on('data', (chunk) => {
    data = `${data}${chunk}`
})

readableStream.on('end', () => {
    console.log(data);
})

readableStream.on('error', (e) => {
    console.log(e.message);
})

