// server.js
//
// Copyright (c) 2016 Zach Deibert
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var fs = require("fs");
var http = require("http");
var commandLineArgs = require("command-line-args");

var argDef = [
    {
        "name": "debug",
        "alias": "d",
        "type": Boolean
    },
    {
        "name": "port",
        "alias": "p",
        "type": Number,
        "defaultValue": 80
    },
    {
        "name": "bind",
        "alias": "b",
        "type": String,
        "defaultValid": "0.0.0.0"
    }
];
var mimes = {
    "ts": "text/x-typescript",
    "js": "text/javascript",
    "html": "text/html",
    "css": "text/css",
    "map": "text/plain",
    "json": "text/json"
};

var args = commandLineArgs(argDef);

function readFile(path) {
    return fs.readFileSync(path).toString();
}

function include(path) {
    eval.apply(global, [
        readFile(path)
    ]);
}

function fail(res) {
    res.statusCode = 404;
    res.end();
}

function handleReq(req, res, url, match) {
    if ( (match && req.match(url) != null) || req.url == url ) {
        var stat = fs.statSync(req.url.substr(1));
        if ( stat.isFile() ) {
            res.statusCode = 200;
            res.setHeader("Content-Type", mimes[req.url.substr(req.url.lastIndexOf('.') + 1)]);
            res.end(readFile(req.url.substr(1)));
        } else {
            fail(res);
        }
        return true;
    } else {
        return false;
    }
}

function request(req) {
    if ( req.url == "/" ) {
        req.url = "/index.html";
    }
    return false;
}

include("out.js");
include("game.js");

var server = http.createServer(args.debug ?
    (req, res) => request(req) ||
                  handleReq(req, res, "/game.js", false) ||
                  handleReq(req, res, "/game.js.map", false) ||
                  handleReq(req, res, "/index.css", false) ||
                  handleReq(req, res, "/index.html", false) ||
                  handleReq(req, res, "/out.js", false) ||
                  handleReq(req, res, "/out.js.map", false) ||
                  handleReq(req, res, "/site.json", false) ||
                  handleReq(req, res, /^\/([a-zA-Z]+\/)+[A-Za-z0-9]+\.ts$/, true) ||
                  fail(res) :
    (req, res) => request(req) ||
                  handleReq(req, res, "/game.js", false) ||
                  handleReq(req, res, "/index.css", false) ||
                  handleReq(req, res, "/index.html", false) ||
                  handleReq(req, res, "/out.js", false) ||
                  handleReq(req, res, "/site.json", false) ||
                  fail(res)
);

server.listen(args.port, args.bind, () => {
    console.log(`Server running at http://localhost:${args.port}/`);
    new Framework.Internal.Server();
});
