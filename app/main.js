const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('ready', () => { 

  mainWindow = new BrowserWindow({
    width: 3000,
    height: 3000,
    frame: false,
    transparent: true,
    // width: 300,
    // height: 500,
    // maxWidth: 800,
    // maxHeight: 600
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
});
