const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var win;

function open() {
    win = new BrowserWindow({
        "width": 800,
        "height": 600
    });
    win.loadURL("file://" + process.cwd() + "/index.html");
    win.on("closed", () => {
        if ( process.platform == "darwin" ) {
            win = null;
        } else {
            app.quit();
        }
    });
}

app.on("ready", open);

app.on("activate", () => {
    if ( win == null ) {
        open();
    }
});
