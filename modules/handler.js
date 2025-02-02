const fs = require('fs');

exports.appendText = (filePath, text, callback) => {
    fs.appendFile(filePath, text + '\n', (err) => {
        callback(err);
    });
};

// we use callback because the node.js is asynchronous so it doesnt need to wait for the operation and it can handle another request
// also we use callback to handle the errors otherwise the system crashes

exports.readText = (filePath, callback) => {
    fs.readFile(filePath, 'utf8', (err, data) => { //utf8  to read it human-readable not buffered
        callback(err, data);
    });
};