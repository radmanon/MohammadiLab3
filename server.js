const http = require('http');
const url = require('url');
const utils = require('./modules/utils');
const fileHandler = require('./modules/handler');
const msg = require('./lang/en').msg;

const fs = require('fs');


http.createServer(function(req, res){
    const q = url.parse(req.url, true);
    const pathname = q.pathname;
    const qdata = q.query;
    const name = qdata.name

    if (pathname === '/getDate') {
        if (!qdata.name || qdata.name.trim() === ''){
            res.writeHead(400, {'Content-Type': 'text/html'});
            return res.end(`${msg.noName}`)
        }
    const serverTime = utils.getDate();
    const responseMsg = `${msg.greeting.replace('%1', name)} Server current date and time is ${serverTime}`

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(responseMsg);

} else if (pathname === '/writeFile') {
        if(!qdata.text) {
            res.writeHead(400, {'Content-Type': 'text/html'});
            return res.end(`${msg.missingText}`)
        }
        fileHandler.appendText('file.txt', qdata.text, (err) => {
            if (err){
                res.writeHead(500, {'Content-Type': 'text/html'});
                return res.end(`${msg.errorWriting}`)
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(`${msg.successWriting.replace('%1', qdata.text)}`);
        });
    } else if (pathname.startsWith('/readFile/')){
        console.log(pathname)
        const filename = pathname.replace('/readFile/', '').trim() //extract the file name entered by user and trim() because if user enter spaces it will be empty
        if (filename === '') {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(`${msg.noFileName}`);
        }
        fileHandler.readText(filename, (err, data) => {
            if (err){
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end(`${msg.fileNotFound.replace('%1', filename)}`);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(`${msg.successReading.replace('%1', data)}`);
        });
    } else { //if we enter diffrent pathname in url
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end(`${msg.invalidEndpoint}`);
    }
}).listen(8888, () => {
    console.log('Server is running at http://localhost:8888/')
});