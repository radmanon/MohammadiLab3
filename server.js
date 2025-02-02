const http = require('http');
const url = require('url');
const utils = require('./modules/utils');
const fileHandler = require('./modules/handler');
const msg = require('./lang/en').msg;
const fs = require('fs');


class Server {
    constructor(port = 8888){
        this.port = port;
    }

    start(){
        http.createServer((req,res) => this.handleRequest(req, res)).listen(this.port, () => {
            console.log(`Server is running at http://localhost:${this.port}/`);
        });
    }
    handleRequest(req,res){
        const q = url.parse(req.url, true);
        const pathname = q.pathname;
        const qdata = q.query;
        const name = qdata.name

        if (pathname === '/getDate') {
            return this.handleGetDate(res, qdata);
        } else if (pathname === '/writeFile') {
            return this.handleWriteFile(res, qdata);
        } else if (pathname.startsWith('/readFile/')) {
            return this.handleReadFile(res, pathname);
        } else {
            return this.handleInvalidEndpoint(res);
        }
    }

    handleGetDate(res, qdata){
        if (!qdata.name || qdata.name.trim() === '') {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(`<p style="color:red;">${msg.noName}</p>`);
        }
        const serverTime = utils.getDate();
        const responseMsg = `<p style="color:blue;">${msg.greeting.replace('%1', qdata.name)} Server current date and time is ${serverTime}</p>`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(responseMsg);
    }

    handleWriteFile(res, qdata){
        if (!qdata.text || qdata.text.trim() === '') {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(`<p style="color:red;">${msg.missingText}</p>`);
        }
        fileHandler.appendText('file.txt', qdata.text, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                return res.end(`<p style="color:red;">${msg.errorWriting}</p>`);
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<p style="color:blue;">${msg.successWriting.replace('%1', qdata.text.trim())}</p>`);
        });
    }


    handleReadFile(res, pathname){
        const filename = pathname.replace('/readFile/', '').trim(); //extract the file name entered by user and trim() because if user enter spaces it will be empty
        if (!filename || filename.includes('/') || filename.includes('..')) {
            res.writeHead(400, { 'Content-Type': 'text/html' });
            return res.end(`<p style="color:red;">${msg.noFileName}</p>`);
        }
        fileHandler.readText(filename, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end(`<p style="color:red;">${msg.fileNotFound.replace('%1', filename)}</p>`);
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<p style="color:green;">${msg.successReading.replace('%1', data)}</p>`);
        });
    }

    handleInvalidEndpoint(res){
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<p style="color:red;">${msg.invalidEndpoint}</p>`);
    }
}
