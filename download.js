// Dependencies
/*global require*/
var fs = require('fs');
var url = require('url');
var http = require('http');

/*var exec = require('child_process').exec;
var spawn = require('child_process').spawn;*/


var DOWNLOAD_DIR = './downloads/';

// We will be downloading the files to a directory, so make sure it's there
// This step is not required if you have manually created the directory
/*var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
var child = exec(mkdir, function(err, stdout, stderr) {
    if (err) throw err;
    else download_file_httpget(file_url);
});*/




var files;
// Function to download file using HTTP.get
// Function to download file using HTTP.get
var download_file_httpget = function (file_url, callBack) {
    var options = {
        host: url.parse(file_url).host,
        port: 80,
        path: url.parse(file_url).pathname
    };

    var file_name = url.parse(file_url).pathname.split('/').pop();
    var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

    http.get(options, function (res) {
        res.on('data', function (data) {
            file.write(data);
        }).on('end', function () {
            file.end();
            console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
            callBack();
        });
    });
};



var multiDownload = function (callback) {
    if (files.length > 0) {
        var file = files.shift();

        var file_url = file['images-link-href'];
        console.log('found into json: ' + file_url);
        download_file_httpget(file_url, function () {
            multiDownload(callback);

        });
    } else {
        callback();
    }
};

fs.readFile('./datas.json', 'utf8', function (err, data) {
    console.log('starting reading json file');
    if (err) {
        throw err;
    } // we'll not consider error handling for now
    files = JSON.parse(data);
    console.log('now starting download');
    multiDownload(function () {
        console.log("reading finishes");
    });

});