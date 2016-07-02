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
var https = require("https");
var commandLineArgs = require("command-line-args");
var querystring = require("querystring");
var websocket = require("websocket");

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
global.Event = (function (_super) {
    __extends(Event, _super);
    function Event(type) {
        _super.call(this);
        this.type = type;
    }
    return Event;
}(Object));

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
var secureProperties = [
    "auth.secret"
];

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
    if ( req.url == "/" || req.url.startsWith("/index.html?") || req.url.startsWith("/?") ) {
        req.url = "/index.html";
    }
    return false;
}

include("framework.js");
include("game.js");

global.window = {
    serverInfo: new Framework.Internal.SiteInfo(true),
    request: function(options, body, callback) {
        var req = https.request(options, res => {
            res.setEncoding("utf8");
            var data = "";
            res.on("data", chunk => data += chunk.toString());
            res.on("end", () => {
                try {
                    data = JSON.parse(data);
                } catch ( SyntaxError ) {
                }
                callback(data);
            });
        });
        req.on("error", e => {
            console.log(e.message);
            callback(null);
        });
        if ( body != null ) {
            req.write(querystring.stringify(body));
        }
        req.end();
    },
    readFile: function(path) {
        try {
            var stat = fs.statSync(path);
            if ( stat && stat.isFile() ) {
                return readFile(path);
            } else {
                return null;
            }
        } catch ( e ) {
            return null;
        }
    },
    writeFile: function(path, content) {
        fs.writeFileSync(path, content, {
            "mode": 0o644
        });
    },
    Framework: global.Framework,
    window: global
};
global.window.serverInfo.addEventListener("load", () => {
    for ( var i = 0; i < secureProperties.length; ++i ) {
        var namespaces = secureProperties[i].split('.');
        var scope = global.window.serverInfo;
        for ( var i = 0; i < namespaces.length - 1; ++i ) {
            if ( scope.hasOwnProperty(namespaces[i]) ) {
                scope = scope[namespaces[i]];
            } else {
                scope = null;
                break;
            }
        }
        if ( scope != null && scope.hasOwnProperty(namespaces[namespaces.length - 1]) ) {
            scope[namespaces[namespaces.length - 1]] = readFile(scope[namespaces[namespaces.length - 1]]);
        }
    }
});
global.window.serverInfo.load(readFile("site.json"));

var server = http.createServer(args.debug ?
    (req, res) => request(req) ||
                  handleReq(req, res, "/game.js", false) ||
                  handleReq(req, res, "/game.js.map", false) ||
                  handleReq(req, res, "/index.css", false) ||
                  handleReq(req, res, "/index.html", false) ||
                  handleReq(req, res, "/framework.js", false) ||
                  handleReq(req, res, "/framework.js.map", false) ||
                  handleReq(req, res, "/site.json", false) ||
                  handleReq(req, res, /^\/([a-zA-Z]+\/)+[A-Za-z0-9]+\.ts$/, true) ||
                  fail(res) :
    (req, res) => request(req) ||
                  handleReq(req, res, "/game.js", false) ||
                  handleReq(req, res, "/index.css", false) ||
                  handleReq(req, res, "/index.html", false) ||
                  handleReq(req, res, "/framework.js", false) ||
                  handleReq(req, res, "/site.json", false) ||
                  fail(res)
);

var srv = new Framework.Network.Server();

server.listen(args.port, args.bind, () => {
    console.log(`Server running at http://localhost:${args.port}/`);
});

var wsserver = new websocket.server({
    httpServer: server,
    autoAcceptConnections: false
});

wsserver.on("request", req => {
    var conn = req.accept("web-game-framework", req.origin);
    var callback = data => conn.sendUTF(JSON.stringify(data));
    srv.dispatchEvent(new Framework.Network.SocketEvent("connect", callback, conn.remoteAddress));
    conn.on("message", message => {
        if ( message.type == "utf8" ) {
            srv.dispatchEvent(new Framework.Network.SocketEvent("data", callback, conn.remoteAddress, JSON.parse(message.utf8Data)));
        }
    });
    conn.on("close", (reason, desc) => {
        srv.dispatchEvent(new Framework.Network.SocketEvent("close", callback, conn.remoteAddress, null, desc));
    });
});

srv.run();
